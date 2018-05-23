class FirefoxAutorepeatbutton extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="autorepeatbutton-icon"></xul:image>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}