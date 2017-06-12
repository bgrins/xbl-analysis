class XblButtonImage extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="button-image-icon" xbl:inherits="src=image">
</image>`;
    let comment = document.createComment("Creating xbl-button-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-image", XblButtonImage);
