class FirefoxHandler extends FirefoxHandlerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox flex="1" equalsize="always">
<xul:hbox flex="1" align="center" inherits="tooltiptext=typeDescription">
<xul:image src="moz-icon://goat?size=16" class="typeIcon" inherits="src=typeIcon" height="16" width="16">
</xul:image>
<xul:label flex="1" crop="end" inherits="value=typeDescription">
</xul:label>
</xul:hbox>
<xul:hbox flex="1" align="center" inherits="tooltiptext=actionDescription">
<xul:image inherits="src=actionIcon" height="16" width="16" class="actionIcon">
</xul:image>
<xul:label flex="1" crop="end" inherits="value=actionDescription">
</xul:label>
</xul:hbox>
</xul:hbox>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-handler", FirefoxHandler);
