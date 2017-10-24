class FirefoxButtonImage extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="button-image-icon" inherits="src=image">
</xul:image>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-button-image", FirefoxButtonImage);
