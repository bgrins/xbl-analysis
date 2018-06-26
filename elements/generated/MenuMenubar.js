class MenuMenubar extends MenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></label>
      <children includes="menupopup"></children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}