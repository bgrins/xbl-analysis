class FirefoxDialogheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:label class="dialogheader-title" inherits="value=title,crop" crop="right" flex="1">
</xul:label>
<xul:label class="dialogheader-description" inherits="value=description">
</xul:label>`;
    let comment = document.createComment("Creating firefox-dialogheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-dialogheader", FirefoxDialogheader);
