class XblHandlerSelected extends XblHandlerBase {
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
<hbox flex="1">
<menulist class="actionsMenu" flex="1" crop="end" selectedIndex="1" inherits="tooltiptext=actionDescription" oncommand="Services.prefs.getBoolPref('browser.preferences.useOldOrganization') ?                           gApplicationsPane.onSelectAction(event.originalTarget) :                           gMainPane.onSelectAction(event.originalTarget)">
<menupopup>
</menupopup>
</menulist>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating xbl-handler-selected");
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("xbl-handler-selected", XblHandlerSelected);
