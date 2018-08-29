class MozMenuMenubarIconic extends MozMenuBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="menubar-left" inherits="src=image"></image>
      <label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></label>
      <children includes="menupopup"></children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}