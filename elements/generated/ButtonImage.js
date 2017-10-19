class FirefoxButtonImage extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="button-image-icon" inherits="src=image">
</xul:image>`;
    let comment = document.createComment("Creating firefox-button-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-button-image", FirefoxButtonImage);
