class FirefoxMenucaption extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:label class="menu-text" inherits="value=label,crop" crop="right">
</xul:label>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menucaption", FirefoxMenucaption);
