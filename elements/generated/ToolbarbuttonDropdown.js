class ToolbarbuttonDropdown extends MenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="menubar-left" inherits="src=image"></image>
      <label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></label>
      <hbox class="menubar-right"></hbox>
      <children includes="menupopup"></children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}