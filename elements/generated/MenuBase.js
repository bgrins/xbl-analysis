class XblMenuBase extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menu-base");
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
    undefined;
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
  appendItem(aLabel, aValue) {}
  insertItemAt(aIndex, aLabel, aValue) {}
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
customElements.define("xbl-menu-base", XblMenuBase);
