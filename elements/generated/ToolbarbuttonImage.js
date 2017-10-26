class FirefoxToolbarbuttonImage extends FirefoxToolbarbutton {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="toolbarbutton-icon" inherits="src=image"></xul:image>
    `;
  }
}
customElements.define("firefox-toolbarbutton-image", FirefoxToolbarbuttonImage);
