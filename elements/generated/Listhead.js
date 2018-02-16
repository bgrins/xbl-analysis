class FirefoxListhead extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:listheaditem>
        <children includes="listheader"></children>
      </xul:listheaditem>
    `;

    this.setupHandlers();
  }

  setupHandlers() {

  }
}