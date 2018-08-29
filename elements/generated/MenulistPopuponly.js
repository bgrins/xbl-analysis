class MozMenulistPopuponly extends MozMenulist {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="menupopup"></children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}