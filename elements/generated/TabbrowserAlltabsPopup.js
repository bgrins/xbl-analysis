class XblTabbrowserAlltabsPopup extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-tabbrowser-alltabs-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _tabOnAttrModified(aEvent) {
    var tab = aEvent.target;
    if (tab.mCorrespondingMenuitem)
      this._setMenuitemAttributes(tab.mCorrespondingMenuitem, tab);
  }
  _tabOnTabClose(aEvent) {
    var tab = aEvent.target;
    if (tab.mCorrespondingMenuitem)
      this.removeChild(tab.mCorrespondingMenuitem);
  }
  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "TabAttrModified":
        this._tabOnAttrModified(aEvent);
        break;
      case "TabClose":
        this._tabOnTabClose(aEvent);
        break;
    }
  }
  _updateTabsVisibilityStatus() {
    var tabContainer = gBrowser.tabContainer;
    // We don't want menu item decoration unless there is overflow.
    if (tabContainer.getAttribute("overflow") != "true") {
      return;
    }

    let windowUtils = window
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIDOMWindowUtils);
    let tabstripRect = windowUtils.getBoundsWithoutFlushing(
      tabContainer.mTabstrip
    );
    for (let menuitem of this.childNodes) {
      let curTab = menuitem.tab;
      if (!curTab) {
        // "Undo close tab", menuseparator, or entries put here by addons.
        continue;
      }
      let curTabRect = windowUtils.getBoundsWithoutFlushing(curTab);
      if (
        curTabRect.left >= tabstripRect.left &&
        curTabRect.right <= tabstripRect.right
      ) {
        menuitem.setAttribute("tabIsVisible", "true");
      } else {
        menuitem.removeAttribute("tabIsVisible");
      }
    }
  }
  _createTabMenuItem(aTab) {
    var menuItem = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menuitem"
    );

    menuItem.setAttribute(
      "class",
      "menuitem-iconic alltabs-item menuitem-with-favicon"
    );

    this._setMenuitemAttributes(menuItem, aTab);

    aTab.mCorrespondingMenuitem = menuItem;
    menuItem.tab = aTab;

    this.appendChild(menuItem);
  }
  _setMenuitemAttributes(aMenuitem, aTab) {
    aMenuitem.setAttribute("label", aTab.label);
    aMenuitem.setAttribute("crop", "end");

    if (aTab.hasAttribute("busy")) {
      aMenuitem.setAttribute("busy", aTab.getAttribute("busy"));
      aMenuitem.removeAttribute("image");
    } else {
      aMenuitem.setAttribute("image", aTab.getAttribute("image"));
      aMenuitem.removeAttribute("busy");
    }

    if (aTab.hasAttribute("pending"))
      aMenuitem.setAttribute("pending", aTab.getAttribute("pending"));
    else aMenuitem.removeAttribute("pending");

    if (aTab.selected) aMenuitem.setAttribute("selected", "true");
    else aMenuitem.removeAttribute("selected");

    function addEndImage() {
      let endImage = document.createElement("image");
      endImage.setAttribute("class", "alltabs-endimage");
      let endImageContainer = document.createElement("hbox");
      endImageContainer.setAttribute("align", "center");
      endImageContainer.setAttribute("pack", "center");
      endImageContainer.appendChild(endImage);
      aMenuitem.appendChild(endImageContainer);
      return endImage;
    }

    if (aMenuitem.firstChild) aMenuitem.firstChild.remove();
    if (aTab.hasAttribute("muted")) addEndImage().setAttribute("muted", "true");
    else if (aTab.hasAttribute("soundplaying"))
      addEndImage().setAttribute("soundplaying", "true");
  }
}
customElements.define(
  "xbl-tabbrowser-alltabs-popup",
  XblTabbrowserAlltabsPopup
);
