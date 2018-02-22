class FirefoxMenulistPopuponly extends FirefoxMenulist {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children includes="menupopup"></children>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}