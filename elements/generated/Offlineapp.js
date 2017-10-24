class FirefoxOfflineapp extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children>
<xul:listcell inherits="label=origin">
</xul:listcell>
<xul:listcell inherits="label=usage">
</xul:listcell>
</children>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-offlineapp", FirefoxOfflineapp);
