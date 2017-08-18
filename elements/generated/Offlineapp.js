class FirefoxOfflineapp extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<listcell inherits="label=origin">
</listcell>
<listcell inherits="label=usage">
</listcell>
</children>`;
    let comment = document.createComment("Creating firefox-offlineapp");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-offlineapp", FirefoxOfflineapp);
