class XblListheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<image class="listheader-icon">
</image>
<xbl-text-label class="listheader-label" inherits="value=label,crop" flex="1" crop="right">
</xbl-text-label>
<image class="listheader-sortdirection" inherits="sortDirection">
</image>`;
    let comment = document.createComment("Creating xbl-listheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listheader", XblListheader);
