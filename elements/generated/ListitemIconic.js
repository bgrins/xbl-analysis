class FirefoxListitemIconic extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:listcell class="listcell-iconic" inherits="label,image,crop,disabled,flexlabel">
</xul:listcell>
</children>`;
    let comment = document.createComment("Creating firefox-listitem-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listitem-iconic", FirefoxListitemIconic);
