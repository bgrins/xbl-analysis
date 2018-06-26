class Tabs extends Basecontrol {
  connectedCallback() {
    super.connectedCallback()
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

    if (!this.hasAttribute("orient"))
      this.setAttribute("orient", "horizontal");

    if (this.tabbox && this.tabbox.hasAttribute("selectedIndex")) {
      let selectedIndex = parseInt(this.tabbox.getAttribute("selectedIndex"));
      this.selectedIndex = selectedIndex > 0 ? selectedIndex : 0;
      return;
    }

    var children = this.childNodes;
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

    this._setupEventListeners();
  }
  /**
   * nsIDOMXULSelectControlElement
   */
  get itemCount() {
    return this.childNodes.length
  }

  set value(val) {
    this.setAttribute("value", val);
    var children = this.childNodes;
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
      Array.forEach(this.childNodes, function(aTab) {
        if (aTab.selected && aTab != tab)
          aTab._selected = false;
      });
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
    const tabs = this.childNodes;
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
    const tabs = this.childNodes;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].selected)
        return tabs[i];
    }
    return null;
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
    return tabpanelsElm.childNodes[tabElmIdx];
  }

  getIndexOfItem(item) {
    return Array.indexOf(this.childNodes, item);
  }

  getItemAtIndex(index) {
    return this.childNodes.item(index);
  }

  _selectNewTab(aNewTab, aFallbackDir, aWrap) {
    var requestedTab = aNewTab;
    while (aNewTab.hidden || aNewTab.disabled || !this._canAdvanceToTab(aNewTab)) {
      aNewTab = aFallbackDir == -1 ? aNewTab.previousSibling : aNewTab.nextSibling;
      if (!aNewTab && aWrap)
        aNewTab = aFallbackDir == -1 ? this.childNodes[this.childNodes.length - 1] :
        this.childNodes[0];
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
    var startTab = this.selectedItem;
    var next = startTab[aDir == -1 ? "previousSibling" : "nextSibling"];
    if (!next && aWrap) {
      next = aDir == -1 ? this.childNodes[this.childNodes.length - 1] :
        this.childNodes[0];
    }
    if (next && next != startTab) {
      this._selectNewTab(next, aDir, aWrap);
    }
  }

  appendItem(label, value) {
    var XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var tab = document.createElementNS(XULNS, "tab");
    tab.setAttribute("label", label);
    tab.setAttribute("value", value);
    this.appendChild(tab);
    return tab;
  }

  _setupEventListeners() {

  }
}