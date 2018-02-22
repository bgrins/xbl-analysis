class FirefoxMenuMenubarIconic extends FirefoxMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="menubar-left" inherits="src=image"></xul:image>
      <xul:label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></xul:label>
      <children includes="menupopup"></children>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}