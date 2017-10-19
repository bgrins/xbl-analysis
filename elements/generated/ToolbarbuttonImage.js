class FirefoxToolbarbuttonImage extends FirefoxToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="toolbarbutton-icon" inherits="src=image">
</xul:image>`;
    let comment = document.createComment(
      "Creating firefox-toolbarbutton-image"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarbutton-image", FirefoxToolbarbuttonImage);
