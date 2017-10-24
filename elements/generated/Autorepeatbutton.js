class FirefoxAutorepeatbutton extends FirefoxScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="autorepeatbutton-icon">
</xul:image>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-autorepeatbutton", FirefoxAutorepeatbutton);
