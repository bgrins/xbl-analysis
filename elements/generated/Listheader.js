class FirefoxListheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:image class="listheader-icon">
</xul:image>
<xul:label class="listheader-label" inherits="value=label,crop" flex="1" crop="right">
</xul:label>
<xul:image class="listheader-sortdirection" inherits="sortDirection">
</xul:image>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listheader", FirefoxListheader);
