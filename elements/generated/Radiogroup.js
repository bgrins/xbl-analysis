class XblRadiogroup extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-radiogroup");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get value() {
    return this.getAttribute("value");
  }

  get itemCount() {
    return this._getRadioChildren().length;
  }
  checkAdjacentElement(aNextFlag) {
    var currentElement = this.focusedItem || this.selectedItem;
    var i;
    var children = this._getRadioChildren();
    for (i = 0; i < children.length; ++i) {
      if (children[i] == currentElement) break;
    }
    var index = i;

    if (aNextFlag) {
      do {
        if (++i == children.length) i = 0;
        if (i == index) break;
      } while (
        children[i].hidden || children[i].collapsed || children[i].disabled
      );
      // XXX check for display/visibility props too

      this.selectedItem = children[i];
      children[i].doCommand();
    } else {
      do {
        if (i == 0) i = children.length;
        if (--i == index) break;
      } while (
        children[i].hidden || children[i].collapsed || children[i].disabled
      );
      // XXX check for display/visibility props too

      this.selectedItem = children[i];
      children[i].doCommand();
    }
  }
  _getRadioChildren() {
    if (this._radioChildren) return this._radioChildren;

    var radioChildren = [];
    var doc = this.ownerDocument;

    if (this.hasChildNodes()) {
      // Don't store the collected child nodes immediately,
      // collecting the child nodes could trigger constructors
      // which would blow away our list.

      const nsIDOMNodeFilter = Components.interfaces.nsIDOMNodeFilter;
      var iterator = doc.createTreeWalker(
        this,
        nsIDOMNodeFilter.SHOW_ELEMENT,
        this._filterRadioGroup
      );
      while (iterator.nextNode()) radioChildren.push(iterator.currentNode);
      return (this._radioChildren = radioChildren);
    }

    // We don't have child nodes.
    const XUL_NS =
      "http://www.mozilla.org/keymaster/" + "gatekeeper/there.is.only.xul";
    var elems = doc.getElementsByAttribute("group", this.id);
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].namespaceURI == XUL_NS && elems[i].localName == "radio") {
        radioChildren.push(elems[i]);
      }
    }
    return (this._radioChildren = radioChildren);
  }
  _filterRadioGroup(node) {
    switch (node.localName) {
      case "radio":
        return NodeFilter.FILTER_ACCEPT;
      case "template":
      case "radiogroup":
        return NodeFilter.FILTER_REJECT;
      default:
        return NodeFilter.FILTER_SKIP;
    }
  }
  getIndexOfItem(item) {}
  getItemAtIndex(index) {
    var children = this._getRadioChildren();
    return index >= 0 && index < children.length ? children[index] : null;
  }
  appendItem(label, value) {
    var XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var radio = document.createElementNS(XULNS, "radio");
    radio.setAttribute("label", label);
    radio.setAttribute("value", value);
    this.appendChild(radio);
    this._radioChildren = null;
    return radio;
  }
  insertItemAt(index, label, value) {
    var XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var radio = document.createElementNS(XULNS, "radio");
    radio.setAttribute("label", label);
    radio.setAttribute("value", value);
    var before = this.getItemAtIndex(index);
    if (before) before.parentNode.insertBefore(radio, before);
    else this.appendChild(radio);
    this._radioChildren = null;
    return radio;
  }
  removeItemAt(index) {
    var remove = this.getItemAtIndex(index);
    if (remove) {
      remove.remove();
      this._radioChildren = null;
    }
    return remove;
  }
}
customElements.define("xbl-radiogroup", XblRadiogroup);
