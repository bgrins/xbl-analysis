class FirefoxOfflineapp extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:listcell inherits="label=origin">
</xul:listcell>
<xul:listcell inherits="label=usage">
</xul:listcell>
</children>`;
    let comment = document.createComment("Creating firefox-offlineapp");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-offlineapp", FirefoxOfflineapp);
