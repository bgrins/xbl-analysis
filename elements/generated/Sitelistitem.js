class XblSitelistitem extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1">
<hbox flex="4" width="50" class="item-box" align="center" inherits="tooltiptext=host">
<xbl-text-label flex="1" crop="end" inherits="value=host">
</xbl-text-label>
</hbox>
<hbox flex="2" width="50" class="item-box" align="center" inherits="tooltiptext=status">
<xbl-text-label flex="1" crop="end" inherits="value=status">
</xbl-text-label>
</hbox>
<hbox flex="1" width="50" class="item-box" align="center" inherits="tooltiptext=usage">
<xbl-text-label flex="1" crop="end" inherits="value=usage">
</xbl-text-label>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating xbl-sitelistitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-sitelistitem", XblSitelistitem);
