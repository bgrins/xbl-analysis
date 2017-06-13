class XblTreecolImage extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="treecol-icon" inherits="src">
</image>`;
    let comment = document.createComment("Creating xbl-treecol-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-image", XblTreecolImage);
