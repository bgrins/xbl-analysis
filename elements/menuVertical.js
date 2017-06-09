class XblMenuVertical extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<hbox flex="1" align="center">
<vbox flex="1" align="center">
<image class="toolbarbutton-icon" xbl:inherits="validate,src=image,label,consumeanchor">
</image>
<label class="toolbarbutton-text" crop="right" flex="1" xbl:inherits="value=label,accesskey,crop,dragover-top,wrap">
</label>
<label class="toolbarbutton-multiline-text" flex="1" xbl:inherits="xbl:text=label,accesskey,wrap">
</label>
</vbox>
<dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" xbl:inherits="disabled,label">
</dropmarker>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-vertical ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-vertical", XblMenuVertical);
