class FirefoxOfflineapp extends FirefoxListitem {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children>
        <xul:listcell inherits="label=origin"></xul:listcell>
        <xul:listcell inherits="label=usage"></xul:listcell>
      </children>
    `;

    this.setupHandlers();
  }

  setupHandlers() {

  }
}