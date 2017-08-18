class XblHandler extends XblHandlerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1" equalsize="always">
<hbox flex="1" align="center" inherits="tooltiptext=typeDescription">
<image src="moz-icon://goat?size=16" class="typeIcon" inherits="src=typeIcon" height="16" width="16">
</image>
<xbl-text-label flex="1" crop="end" inherits="value=typeDescription">
</xbl-text-label>
</hbox>
<hbox flex="1" align="center" inherits="tooltiptext=actionDescription">
<image inherits="src=actionIcon" height="16" width="16" class="actionIcon">
</image>
<xbl-text-label flex="1" crop="end" inherits="value=actionDescription">
</xbl-text-label>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating xbl-handler");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-handler", XblHandler);
