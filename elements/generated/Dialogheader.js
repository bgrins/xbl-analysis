class XblDialogheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xbl-text-label class="dialogheader-title" inherits="value=title,crop" crop="right" flex="1">
</xbl-text-label>
<xbl-text-label class="dialogheader-description" inherits="value=description">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-dialogheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dialogheader", XblDialogheader);
