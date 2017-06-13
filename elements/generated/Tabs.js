class XblTabs extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<spacer class="tabs-left">
</spacer>
<children>
</children>
<spacer class="tabs-right" flex="1">
</spacer>`;
    let comment = document.createComment("Creating xbl-tabs");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get itemCount() {
    return this.childNodes.length;
  }

  get value() {
    return this.getAttribute("value");
  }
  getRelatedElement(aTabElm) {
    if (!aTabElm) return null;

    let tabboxElm = this.tabbox;
    if (!tabboxElm) return null;

    let tabpanelsElm = tabboxElm.tabpanels;
    if (!tabpanelsElm) return null;

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
        return ownerDoc.getAnonymousElementByAttribute(
          bindingParent,
          "id",
          linkedPanelId
        );

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
    while (
      aNewTab.hidden ||
      aNewTab.disabled ||
      !this._canAdvanceToTab(aNewTab)
    ) {
      aNewTab = aFallbackDir == -1
        ? aNewTab.previousSibling
        : aNewTab.nextSibling;
      if (!aNewTab && aWrap)
        aNewTab = aFallbackDir == -1
          ? this.childNodes[this.childNodes.length - 1]
          : this.childNodes[0];
      if (!aNewTab || aNewTab == requestedTab) return;
    }

    var isTabFocused = false;
    try {
      isTabFocused =
        document.commandDispatcher.focusedElement == this.selectedItem;
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
            if (el == this.tabbox || el == selectedPanel) return;
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
      next = aDir == -1
        ? this.childNodes[this.childNodes.length - 1]
        : this.childNodes[0];
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
  insertItemAt(index, label, value) {
    var XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var tab = document.createElementNS(XULNS, "tab");
    tab.setAttribute("label", label);
    tab.setAttribute("value", value);
    var before = this.getItemAtIndex(index);
    if (before) this.insertBefore(tab, before);
    else this.appendChild(tab);
    return tab;
  }
  removeItemAt(index) {
    var remove = this.getItemAtIndex(index);
    if (remove) this.removeChild(remove);
    return remove;
  }
}
customElements.define("xbl-tabs", XblTabs);
