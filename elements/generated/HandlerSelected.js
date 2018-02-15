class FirefoxHandlerSelected extends FirefoxHandlerBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox flex="1" equalsize="always">
        <xul:hbox flex="1" align="center" inherits="tooltiptext=typeDescription">
          <xul:image src="moz-icon://goat?size=16" class="typeIcon" inherits="src=typeIcon" height="16" width="16"></xul:image>
          <xul:label flex="1" crop="end" inherits="value=typeDescription"></xul:label>
        </xul:hbox>
        <xul:hbox flex="1">
          <xul:menulist class="actionsMenu" flex="1" crop="end" selectedIndex="1" inherits="tooltiptext=actionDescription" oncommand="gMainPane.onSelectAction(event.originalTarget)">
            <xul:menupopup></xul:menupopup>
          </xul:menulist>
        </xul:hbox>
      </xul:hbox>
    `;

    gMainPane.rebuildActionsMenu();

  }

}