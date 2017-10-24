class FirefoxTreecolImage extends FirefoxTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="treecol-icon" inherits="src">
</xul:image>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treecol-image", FirefoxTreecolImage);
