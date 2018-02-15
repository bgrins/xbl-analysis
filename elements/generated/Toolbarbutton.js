class FirefoxToolbarbutton extends FirefoxButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <xul:image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor"></xul:image>
      <xul:label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap"></xul:label>
      <xul:label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap"></xul:label>
      <children includes="box"></children>
    `;

  }

}