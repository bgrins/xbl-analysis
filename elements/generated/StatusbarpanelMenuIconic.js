class FirefoxStatusbarpanelMenuIconic extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="statusbarpanel-icon" inherits="src,src=image">
</xul:image>
<children>
</children>`;
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-statusbarpanel-menu-iconic",
  FirefoxStatusbarpanelMenuIconic
);
