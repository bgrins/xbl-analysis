class FirefoxToolbarbuttonDropdown extends FirefoxMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="menubar-left" inherits="src=image"></xul:image>
      <xul:label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></xul:label>
      <xul:hbox class="menubar-right"></xul:hbox>
      <children includes="menupopup"></children>
    `;

  }

}