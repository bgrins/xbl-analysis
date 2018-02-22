class FirefoxDropmarker extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:image class="dropmarker-icon"></xul:image>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}