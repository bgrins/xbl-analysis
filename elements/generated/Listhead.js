class FirefoxListhead extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:listheaditem>
<children includes="listheader">
</children>
</xul:listheaditem>`;
    let comment = document.createComment("Creating firefox-listhead");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listhead", FirefoxListhead);
