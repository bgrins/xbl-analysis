class FirefoxToolbarbuttonImage extends FirefoxToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="toolbarbutton-icon" inherits="src=image">
</image>`;
    let comment = document.createComment(
      "Creating firefox-toolbarbutton-image"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarbutton-image", FirefoxToolbarbuttonImage);
