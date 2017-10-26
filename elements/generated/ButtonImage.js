class FirefoxButtonImage extends FirefoxButton {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="button-image-icon" inherits="src=image"></xul:image>
    `;
  }
}
customElements.define("firefox-button-image", FirefoxButtonImage);
