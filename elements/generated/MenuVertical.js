class XblMenuVertical extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<hbox flex="1" align="center">
<vbox flex="1" align="center">
<image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</image>
<xbl-text-label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,dragover-top,wrap">
</xbl-text-label>
<xbl-text-label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xbl-text-label>
</vbox>
<dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label">
</dropmarker>
</hbox>`;
    let comment = document.createComment("Creating xbl-menu-vertical");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-vertical", XblMenuVertical);
