class FirefoxTreecolImage extends FirefoxTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="treecol-icon" inherits="src">
</xul:image>`;
    let comment = document.createComment("Creating firefox-treecol-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treecol-image", FirefoxTreecolImage);
