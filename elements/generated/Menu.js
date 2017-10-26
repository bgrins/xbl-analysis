class FirefoxMenu extends FirefoxToolbarbutton {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <xul:image class="toolbarbutton-icon" inherits="validate,src=image,label,type,consumeanchor"></xul:image>
      <xul:label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,dragover-top,wrap"></xul:label>
      <xul:label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap"></xul:label>
      <xul:dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label"></xul:dropmarker>
    `;
  }
}
customElements.define("firefox-menu", FirefoxMenu);
