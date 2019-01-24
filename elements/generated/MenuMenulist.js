/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuMenulist extends MozBaseControl {
  constructor() {
    super();

    this.addEventListener("command", (event) => { if (event.target.parentNode.parentNode == this) this.selectedItem = event.target; }, true);

    this.addEventListener("popupshowing", (event) => {
      if (event.target.parentNode == this) {
        this.activeChild = null;
        if (this.selectedItem)
          // Not ready for auto-setting the active child in hierarchies yet.
          // For now, only do this when the outermost menupopup opens.
          this.activeChild = this.mSelectedInternal;
      }
    });

    this.addEventListener("keypress", (event) => {
      if (!event.defaultPrevented &&
        (event.keyCode == KeyEvent.DOM_VK_UP ||
          event.keyCode == KeyEvent.DOM_VK_DOWN ||
          event.keyCode == KeyEvent.DOM_VK_PAGE_UP ||
          event.keyCode == KeyEvent.DOM_VK_PAGE_DOWN ||
          event.keyCode == KeyEvent.DOM_VK_HOME ||
          event.keyCode == KeyEvent.DOM_VK_END ||
          event.keyCode == KeyEvent.DOM_VK_BACK_SPACE ||
          event.charCode > 0)) {
        // Moving relative to an item: start from the currently selected item
        this.activeChild = this.mSelectedInternal;
        if (this.handleKeyPress(event)) {
          this.activeChild.doCommand();
          event.preventDefault();
        }
      }
    }, { mozSystemGroup: true });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="menulist-label-box" flex="1">
        <image class="menulist-icon" inherits="src=image"></image>
        <label class="menulist-label" inherits="value=label,crop,accesskey,highlightable" crop="right" flex="1"></label>
        <label class="menulist-highlightable-label" inherits="text=label,crop,accesskey,highlightable" crop="right" flex="1"></label>
      </hbox>
      <dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open"></dropmarker>
      <children includes="menupopup"></children>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    this.mSelectedInternal = null;
    this.mAttributeObserver = null;
    this.setInitialSelection();

  }

  set value(val) {
    // if the new value is null, we still need to remove the old value
    if (val == null)
      return this.selectedItem = val;

    var arr = null;
    var popup = this.menupopup;
    if (popup)
      arr = popup.getElementsByAttribute("value", val);

    if (arr && arr.item(0))
      this.selectedItem = arr[0];
    else {
      this.selectedItem = null;
      this.setAttribute("value", val);
    }

    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  set crop(val) {
    this.setAttribute('crop', val);
    return val;
  }

  get crop() {
    return this.getAttribute('crop');
  }

  set image(val) {
    this.setAttribute('image', val);
    return val;
  }

  get image() {
    return this.getAttribute('image');
  }

  get label() {
    return this.getAttribute('label');
  }

  set description(val) {
    this.setAttribute('description', val);
    return val;
  }

  get description() {
    return this.getAttribute('description');
  }

  set open(val) {
    this.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute('open');
  }

  get itemCount() {
    return this.menupopup ? this.menupopup.children.length : 0
  }

  get menupopup() {
    var popup = this.firstElementChild;
    while (popup && popup.localName != "menupopup")
      popup = popup.nextElementSibling;
    return popup;
  }

  set selectedIndex(val) {
    var popup = this.menupopup;
    if (popup && 0 <= val) {
      if (val < popup.children.length)
        this.selectedItem = popup.children[val];
    } else
      this.selectedItem = null;
    return val;
  }

  get selectedIndex() {
    // Quick and dirty. We won't deal with hierarchical menulists yet.
    if (!this.selectedItem ||
      !this.mSelectedInternal.parentNode ||
      this.mSelectedInternal.parentNode.parentNode != this)
      return -1;

    var children = this.mSelectedInternal.parentNode.children;
    var i = children.length;
    while (i--)
      if (children[i] == this.mSelectedInternal)
        break;

    return i;
  }

  set selectedItem(val) {
    var oldval = this.mSelectedInternal;
    if (oldval == val)
      return val;

    if (val && !this.contains(val))
      return val;

    if (oldval) {
      oldval.removeAttribute("selected");
      this.mAttributeObserver.disconnect();
    }

    this.mSelectedInternal = val;
    let attributeFilter = ["value", "label", "image", "description"];
    if (val) {
      val.setAttribute("selected", "true");
      for (let attr of attributeFilter) {
        if (val.hasAttribute(attr)) {
          this.setAttribute(attr, val.getAttribute(attr));
        } else {
          this.removeAttribute(attr);
        }
      }

      this.mAttributeObserver = new MutationObserver(this.handleMutation.bind(this));
      this.mAttributeObserver.observe(val, { attributeFilter });
    } else {
      for (let attr of attributeFilter) {
        this.removeAttribute(attr);
      }
    }

    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);

    event = document.createEvent("Events");
    event.initEvent("ValueChange", true, true);
    this.dispatchEvent(event);

    return val;
  }

  get selectedItem() {
    return this.mSelectedInternal;
  }

  setInitialSelection() {
    var popup = this.menupopup;
    if (popup) {
      var arr = popup.getElementsByAttribute("selected", "true");

      var editable = this.editable;
      var value = this.value;
      if (!arr.item(0) && value)
        arr = popup.getElementsByAttribute(editable ? "label" : "value", value);

      if (arr.item(0))
        this.selectedItem = arr[0];
      else if (!editable)
        this.selectedIndex = 0;
    }
  }

  contains(item) {
    if (!item)
      return false;

    var parent = item.parentNode;
    return (parent && parent.parentNode == this);
  }

  handleMutation(aRecords) {
    for (let record of aRecords) {
      let t = record.target;
      if (t == this.mSelectedInternal) {
        let attrName = record.attributeName;
        switch (attrName) {
          case "value":
          case "label":
          case "image":
          case "description":
            if (t.hasAttribute(attrName)) {
              this.setAttribute(attrName, t.getAttribute(attrName));
            } else {
              this.removeAttribute(attrName);
            }
        }
      }
    }
  }

  getIndexOfItem(item) {
    var popup = this.menupopup;
    if (popup) {
      var children = popup.children;
      var i = children.length;
      while (i--)
        if (children[i] == item)
          return i;
    }
    return -1;
  }

  getItemAtIndex(index) {
    var popup = this.menupopup;
    if (popup) {
      var children = popup.children;
      if (index >= 0 && index < children.length)
        return children[index];
    }
    return null;
  }

  appendItem(label, value, description) {
    var popup = this.menupopup ||
      this.appendChild(document.createXULElement("menupopup"));
    var item = document.createXULElement("menuitem");
    item.setAttribute("label", label);
    item.setAttribute("value", value);
    if (description)
      item.setAttribute("description", description);

    popup.appendChild(item);
    return item;
  }

  removeAllItems() {
    this.selectedItem = null;
    var popup = this.menupopup;
    if (popup)
      this.removeChild(popup);
  }
  disconnectedCallback() {
    if (this.mAttributeObserver) {
      this.mAttributeObserver.disconnect();
    }
  }
}

MozXULElement.implementCustomInterface(MozMenuMenulist, [Ci.nsIDOMXULMenuListElement]);
customElements.define("menu-menulist", MozMenuMenulist);

}
