class FirefoxDropmarker extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:image class="dropmarker-icon">
</xul:image>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-dropmarker", FirefoxDropmarker);
