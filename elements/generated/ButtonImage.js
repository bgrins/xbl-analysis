class FirefoxButtonImage extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="button-image-icon" inherits="src=image">
</image>`;
    let comment = document.createComment("Creating firefox-button-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-button-image", FirefoxButtonImage);
