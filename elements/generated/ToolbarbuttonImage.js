class FirefoxToolbarbuttonImage extends FirefoxToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="toolbarbutton-icon" inherits="src=image"></xul:image>
    `;
  }
}
customElements.define("firefox-toolbarbutton-image", FirefoxToolbarbuttonImage);
