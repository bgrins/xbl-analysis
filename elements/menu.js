class XblMenu extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<image class="toolbarbutton-icon" xbl:inherits="validate,src=image,label,type,consumeanchor">
</image>
<label class="toolbarbutton-text" crop="right" flex="1" xbl:inherits="value=label,accesskey,crop,dragover-top,wrap">
</label>
<label class="toolbarbutton-multiline-text" flex="1" xbl:inherits="xbl:text=label,accesskey,wrap">
</label>
<dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" xbl:inherits="disabled,label">
</dropmarker>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu", XblMenu);
