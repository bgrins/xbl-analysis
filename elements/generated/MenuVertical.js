class FirefoxMenuVertical extends FirefoxToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<xul:hbox flex="1" align="center">
<xul:vbox flex="1" align="center">
<xul:image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</xul:image>
<xul:label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,dragover-top,wrap">
</xul:label>
<xul:label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xul:label>
</xul:vbox>
<xul:dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label">
</xul:dropmarker>
</xul:hbox>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menu-vertical", FirefoxMenuVertical);
