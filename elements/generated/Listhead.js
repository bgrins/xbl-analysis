class FirefoxListhead extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:listheaditem>
<children includes="listheader">
</children>
</xul:listheaditem>`;
  }
}
customElements.define("firefox-listhead", FirefoxListhead);
