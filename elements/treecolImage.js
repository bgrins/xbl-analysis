class XblTreecolImage extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="treecol-icon" xbl:inherits="src">
</image>`;
    let comment = document.createComment("Creating xbl-treecol-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-image", XblTreecolImage);
