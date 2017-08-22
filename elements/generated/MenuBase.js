class FirefoxMenuBase extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menu-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set open(val) {
    this.boxObject.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute("open");
  }

  get openedWithKey() {
    return this.boxObject.openedWithKey;
  }

  get itemCount() {
    var menupopup = this.menupopup;
    return menupopup ? menupopup.childNodes.length : 0;
  }

  get menupopup() {
    const XUL_NS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    for (var child = this.firstChild; child; child = child.nextSibling) {
      if (child.namespaceURI == XUL_NS && child.localName == "menupopup")
        return child;
    }
    return null;
  }
  appendItem(aLabel, aValue) {
    return this.insertItemAt(-1, aLabel, aValue);
  }
  insertItemAt(aIndex, aLabel, aValue) {
    const XUL_NS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    var menupopup = this.menupopup;
    if (!menupopup) {
      menupopup = this.ownerDocument.createElementNS(XUL_NS, "menupopup");
      this.appendChild(menupopup);
    }

    var menuitem = this.ownerDocument.createElementNS(XUL_NS, "menuitem");
    menuitem.setAttribute("label", aLabel);
    menuitem.setAttribute("value", aValue);

    var before = this.getItemAtIndex(aIndex);
    if (before) return menupopup.insertBefore(menuitem, before);
    return menupopup.appendChild(menuitem);
  }
  removeItemAt(aIndex) {
    var menupopup = this.menupopup;
    if (menupopup) {
      var item = this.getItemAtIndex(aIndex);
      if (item) return menupopup.removeChild(item);
    }
    return null;
  }
  getIndexOfItem(aItem) {
    var menupopup = this.menupopup;
    if (menupopup) {
      var items = menupopup.childNodes;
      var length = items.length;
      for (var index = 0; index < length; ++index) {
        if (items[index] == aItem) return index;
      }
    }
    return -1;
  }
  getItemAtIndex(aIndex) {
    var menupopup = this.menupopup;
    if (!menupopup || aIndex < 0 || aIndex >= menupopup.childNodes.length)
      return null;

    return menupopup.childNodes[aIndex];
  }
}
customElements.define("firefox-menu-base", FirefoxMenuBase);
