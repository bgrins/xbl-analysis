class FirefoxMenucaption extends FirefoxMenuBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:label class="menu-text" inherits="value=label,crop" crop="right"></xul:label>
    `;
  }
}
customElements.define("firefox-menucaption", FirefoxMenucaption);
