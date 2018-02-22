class FirefoxTreecolImage extends FirefoxTreecolBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="treecol-icon" inherits="src"></xul:image>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}