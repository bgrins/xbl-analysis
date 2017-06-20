class XblMenulist extends XblMenulistBase {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      undefined;
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menulist-label-box" flex="1">
<image class="menulist-icon" inherits="src=image,src">
</image>
<xbl-text-label class="menulist-label" inherits="value=label,crop,accesskey,highlightable" crop="right" flex="1">
</xbl-text-label>
<xbl-text-label class="menulist-highlightable-label" inherits="text=label,crop,accesskey,highlightable" crop="right" flex="1">
</xbl-text-label>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open">
</dropmarker>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get value() {
    return this.getAttribute("value");
  }

  get inputField() {
    return null;
  }

  set crop(val) {
    this.setAttribute("crop", val);
    return val;
  }

  get crop() {
    return this.getAttribute("crop");
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  get label() {
    return this.getAttribute("label");
  }

  set description(val) {
    this.setAttribute("description", val);
    return val;
  }

  get description() {
    return this.getAttribute("description");
  }

  get editable() {
    return this.getAttribute("editable") == "true";
  }

  set open(val) {
    this.menuBoxObject.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute("open");
  }

  get itemCount() {
    return this.menupopup ? this.menupopup.childNodes.length : 0;
  }
  setInitialSelection() {
    var popup = this.menupopup;
    if (popup) {
      var arr = popup.getElementsByAttribute("selected", "true");

      var editable = this.editable;
      var value = this.value;
      if (!arr.item(0) && value)
        arr = popup.getElementsByAttribute(editable ? "label" : "value", value);

      if (arr.item(0)) this.selectedItem = arr[0];
      else if (!editable) this.selectedIndex = 0;
    }
  }
  contains(item) {
    if (!item) return false;

    var parent = item.parentNode;
    return parent && parent.parentNode == this;
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
      var children = popup.childNodes;
      var i = children.length;
      while (i--) if (children[i] == item) return i;
    }
    return -1;
  }
  getItemAtIndex(index) {
    var popup = this.menupopup;
    if (popup) {
      var children = popup.childNodes;
      if (index >= 0 && index < children.length) return children[index];
    }
    return null;
  }
  appendItem(label, value, description) {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var popup =
      this.menupopup ||
      this.appendChild(document.createElementNS(XULNS, "menupopup"));
    var item = document.createElementNS(XULNS, "menuitem");
    item.setAttribute("label", label);
    item.setAttribute("value", value);
    if (description) item.setAttribute("description", description);

    popup.appendChild(item);
    return item;
  }
  insertItemAt(index, label, value, description) {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var popup =
      this.menupopup ||
      this.appendChild(document.createElementNS(XULNS, "menupopup"));
    var item = document.createElementNS(XULNS, "menuitem");
    item.setAttribute("label", label);
    item.setAttribute("value", value);
    if (description) item.setAttribute("description", description);

    if (index >= 0 && index < popup.childNodes.length)
      popup.insertBefore(item, popup.childNodes[index]);
    else popup.appendChild(item);
    return item;
  }
  removeItemAt(index) {
    var popup = this.menupopup;
    if (popup && 0 <= index && index < popup.childNodes.length) {
      var remove = popup.childNodes[index];
      popup.removeChild(remove);
      return remove;
    }
    return null;
  }
  removeAllItems() {
    this.selectedItem = null;
    var popup = this.menupopup;
    if (popup) this.removeChild(popup);
  }
}
customElements.define("xbl-menulist", XblMenulist);
