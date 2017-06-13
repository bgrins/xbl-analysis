class XblMenulist extends XblMenulistBase {
  constructor() {
    super();
  }
  connectedCallback() {
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
}
customElements.define("xbl-menulist", XblMenulist);
