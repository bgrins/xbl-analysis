class FirefoxStatusbarpanelMenuIconic extends FirefoxStatusbarpanel {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="statusbarpanel-icon" inherits="src,src=image"></xul:image>
      <children></children>
    `;
  }
}
customElements.define(
  "firefox-statusbarpanel-menu-iconic",
  FirefoxStatusbarpanelMenuIconic
);
