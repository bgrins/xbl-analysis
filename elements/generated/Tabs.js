/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTabs extends MozBaseControl {
  constructor() {
    super();

    this.addEventListener("DOMMouseScroll", (event) => {
      if (this._prefService.getBoolPref("toolkit.tabbox.switchByScrolling")) {
        if (event.detail > 0) {
          this.advanceSelectedTab(1, false);
        } else {
          this.advanceSelectedTab(-1, false);
        }
        event.stopPropagation();
      }
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <spacer class="tabs-left"></spacer>
      <children></children>
      <spacer class="tabs-right" flex="1"></spacer>
    `));

    this._tabbox = null;

    /**
     * _tabbox is deprecated, it exists only for backwards compatibility.
     */
    this._tabbox = this.tabbox;

    this._prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);

    this.ACTIVE_DESCENDANT_ID = "keyboard-focused-tab-" + Math.trunc(Math.random() * 1000000);

    if (!this.hasAttribute("orient"))
      this.setAttribute("orient", "horizontal");

    if (this.tabbox && this.tabbox.hasAttribute("selectedIndex")) {
      let selectedIndex = parseInt(this.tabbox.getAttribute("selectedIndex"));
      this.selectedIndex = selectedIndex > 0 ? selectedIndex : 0;
      return;
    }

    var children = this.children;
    var length = children.length;
    for (var i = 0; i < length; i++) {
      if (children[i].getAttribute("selected") == "true") {
        this.selectedIndex = i;
        return;
      }
    }

    var value = this.value;
    if (value)
      this.value = value;
    else
      this.selectedIndex = 0;

  }
  /**
   * nsIDOMXULSelectControlElement
   */
  get itemCount() {
    return this.children.length
  }

  set value(val) {
    this.setAttribute("value", val);
    var children = this.children;
    for (var c = children.length - 1; c >= 0; c--) {
      if (children[c].value == val) {
        this.selectedIndex = c;
        break;
      }
    }
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get tabbox() {
    // Memoize the result in a field rather than replacing this property,
    // so that it can be reset along with the binding.
    if (this._tabbox) {
      return this._tabbox;
    }

    let parent = this.parentNode;
    while (parent) {
      if (parent.localName == "tabbox") {
        break;
      }
      parent = parent.parentNode;
    }

    return this._tabbox = parent;
  }

  set selectedIndex(val) {
    var tab = this.getItemAtIndex(val);
    if (tab) {
      for (let otherTab of this.children) {
        if (otherTab != tab && otherTab.selected) {
          otherTab._selected = false;
        }
      }
      tab._selected = true;

      this.setAttribute("value", tab.value);

      let linkedPanel = this.getRelatedElement(tab);
      if (linkedPanel) {
        this.tabbox.setAttribute("selectedIndex", val);

        // This will cause an onselect event to fire for the tabpanel
        // element.
        this.tabbox.tabpanels.selectedPanel = linkedPanel;
      }
    }
    return val;
  }

  get selectedIndex() {
    const tabs = this.children;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].selected)
        return i;
    }
    return -1;
  }

  set selectedItem(val) {
    if (val && !val.selected)
      // The selectedIndex setter ignores invalid values
      // such as -1 if |val| isn't one of our child nodes.
      this.selectedIndex = this.getIndexOfItem(val);
    return val;
  }

  get selectedItem() {
    const tabs = this.children;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].selected)
        return tabs[i];
    }
    return null;
  }

  get ariaFocusedIndex() {
    const tabs = this.children;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id == this.ACTIVE_DESCENDANT_ID)
        return i;
    }
    return -1;
  }

  set ariaFocusedItem(val) {
    let setNewItem = val && this.getIndexOfItem(val) != -1;
    let clearExistingItem = this.ariaFocusedItem && (!val || setNewItem);
    if (clearExistingItem) {
      let ariaFocusedItem = this.ariaFocusedItem;
      ariaFocusedItem.classList.remove("keyboard-focused-tab");
      ariaFocusedItem.id = "";
      this.selectedItem.removeAttribute("aria-activedescendant");
    }

    if (setNewItem) {
      this.ariaFocusedItem = null;
      val.id = this.ACTIVE_DESCENDANT_ID;
      val.classList.add("keyboard-focused-tab");
      this.selectedItem.setAttribute("aria-activedescendant", this.ACTIVE_DESCENDANT_ID);
    }

    return val;
  }

  get ariaFocusedItem() {
    return document.getElementById(this.ACTIVE_DESCENDANT_ID);
  }

  /**
   * nsIDOMXULRelatedElement
   */
  getRelatedElement(aTabElm) {
    if (!aTabElm)
      return null;

    let tabboxElm = this.tabbox;
    if (!tabboxElm)
      return null;

    let tabpanelsElm = tabboxElm.tabpanels;
    if (!tabpanelsElm)
      return null;

    // Get linked tab panel by 'linkedpanel' attribute on the given tab
    // element.
    let linkedPanelId = aTabElm.linkedPanel;
    if (linkedPanelId) {
      let ownerDoc = this.ownerDocument;

      // XXX bug 565858: if XUL tab element is anonymous element then
      // suppose linked tab panel is hosted within the same XBL binding
      // and search it by ID attribute inside an anonymous content of
      // the binding. This is not robust assumption since tab elements may
      // live outside a tabbox element so that for example tab elements
      // can be explicit content but tab panels can be anonymous.

      let bindingParent = ownerDoc.getBindingParent(aTabElm);
      if (bindingParent)
        return ownerDoc.getAnonymousElementByAttribute(bindingParent,
          "id",
          linkedPanelId);

      return ownerDoc.getElementById(linkedPanelId);
    }

    // otherwise linked tabpanel element has the same index as the given
    // tab element.
    let tabElmIdx = this.getIndexOfItem(aTabElm);
    return tabpanelsElm.children[tabElmIdx];
  }

  getIndexOfItem(item) {
    return Array.prototype.indexOf.call(this.children, item);
  }

  getItemAtIndex(index) {
    return this.children.item(index);
  }

  _selectNewTab(aNewTab, aFallbackDir, aWrap) {
    this.ariaFocusedItem = null;

    var requestedTab = aNewTab;
    while (aNewTab.hidden || aNewTab.disabled || !this._canAdvanceToTab(aNewTab)) {
      aNewTab = aFallbackDir == -1 ? aNewTab.previousElementSibling : aNewTab.nextElementSibling;
      if (!aNewTab && aWrap)
        aNewTab = aFallbackDir == -1 ? this.children[this.children.length - 1] :
        this.children[0];
      if (!aNewTab || aNewTab == requestedTab)
        return;
    }

    var isTabFocused = false;
    try {
      isTabFocused =
        (document.commandDispatcher.focusedElement == this.selectedItem);
    } catch (e) {}
    this.selectedItem = aNewTab;
    if (isTabFocused) {
      aNewTab.focus();
    } else if (this.getAttribute("setfocus") != "false") {
      let selectedPanel = this.tabbox.selectedPanel;
      document.commandDispatcher.advanceFocusIntoSubtree(selectedPanel);

      // Make sure that the focus doesn't move outside the tabbox
      if (this.tabbox) {
        try {
          let el = document.commandDispatcher.focusedElement;
          while (el && el != this.tabbox.tabpanels) {
            if (el == this.tabbox || el == selectedPanel)
              return;
            el = el.parentNode;
          }
          aNewTab.focus();
        } catch (e) {}
      }
    }
  }

  _canAdvanceToTab(aTab) {
    return true;
  }

  advanceSelectedTab(aDir, aWrap) {
    var startTab = this.ariaFocusedItem || this.selectedItem;
    var next = startTab[(aDir == -1 ? "previous" : "next") + "ElementSibling"];
    if (!next && aWrap) {
      next = aDir == -1 ? this.children[this.children.length - 1] :
        this.children[0];
    }
    if (next && next != startTab) {
      this._selectNewTab(next, aDir, aWrap);
    }
  }

  appendItem(label, value) {
    var tab = document.createXULElement("tab");
    tab.setAttribute("label", label);
    tab.setAttribute("value", value);
    this.appendChild(tab);
    return tab;
  }
}

MozXULElement.implementCustomInterface(MozTabs, [Ci.nsIDOMXULSelectControlElement, Ci.nsIDOMXULRelatedElement]);
customElements.define("tabs", MozTabs);

}
