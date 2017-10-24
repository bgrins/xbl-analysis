class FirefoxSitelistitem extends FirefoxRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox flex="1">
<xul:hbox flex="4" width="50" class="item-box" align="center" inherits="tooltiptext=host">
<xul:label flex="1" crop="end" inherits="value=host">
</xul:label>
</xul:hbox>
<xul:hbox flex="2" width="50" class="item-box" align="center" inherits="tooltiptext=status">
<xul:label flex="1" crop="end" inherits="value=status">
</xul:label>
</xul:hbox>
<xul:hbox flex="1" width="50" class="item-box" align="center" inherits="tooltiptext=usage">
<xul:label flex="1" crop="end" inherits="value=usage">
</xul:label>
</xul:hbox>
</xul:hbox>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-sitelistitem", FirefoxSitelistitem);
