class XblMenulistDescription extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="menulist-label-box" flex="1">
<image class="menulist-icon" xbl:inherits="src=image,src">
</image>
<label class="menulist-label" xbl:inherits="value=label,crop,accesskey" crop="right" flex="1">
</label>
<label class="menulist-label menulist-description" xbl:inherits="value=description" crop="right" flex="10000">
</label>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" xbl:inherits="disabled,open">
</dropmarker>
<children includes="menupopup">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menulist-description ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-description", XblMenulistDescription);
