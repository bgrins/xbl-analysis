class FirefoxHandlerSelected extends FirefoxHandlerBase {
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
<firefox-text-label flex="1" crop="end" inherits="value=typeDescription">
</firefox-text-label>
</hbox>
<hbox flex="1">
<menulist class="actionsMenu" flex="1" crop="end" selectedIndex="1" inherits="tooltiptext=actionDescription" oncommand="Services.prefs.getBoolPref('browser.preferences.useOldOrganization') ?                           gApplicationsPane.onSelectAction(event.originalTarget) :                           gMainPane.onSelectAction(event.originalTarget)">
<menupopup>
</menupopup>
</menulist>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating firefox-handler-selected");
    this.prepend(comment);

    undefined;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-handler-selected", FirefoxHandlerSelected);
