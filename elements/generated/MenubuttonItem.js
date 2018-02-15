class FirefoxMenubuttonItem extends FirefoxMenuitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:label class="menubutton-text" flex="1" inherits="value=label,accesskey,crop" crop="right"></xul:label>
      <children includes="menupopup"></children>
    `;

  }

}