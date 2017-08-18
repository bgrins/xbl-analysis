class FirefoxSitelistitem extends FirefoxRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1">
<hbox flex="4" width="50" class="item-box" align="center" inherits="tooltiptext=host">
<firefox-text-label flex="1" crop="end" inherits="value=host">
</firefox-text-label>
</hbox>
<hbox flex="2" width="50" class="item-box" align="center" inherits="tooltiptext=status">
<firefox-text-label flex="1" crop="end" inherits="value=status">
</firefox-text-label>
</hbox>
<hbox flex="1" width="50" class="item-box" align="center" inherits="tooltiptext=usage">
<firefox-text-label flex="1" crop="end" inherits="value=usage">
</firefox-text-label>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating firefox-sitelistitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-sitelistitem", FirefoxSitelistitem);
