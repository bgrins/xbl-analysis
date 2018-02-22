class FirefoxContainer extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox flex="1" equalsize="always">
        <xul:hbox flex="1" align="center">
          <xul:hbox inherits="data-identity-icon=containerIcon,data-identity-color=containerColor" height="24" width="24" class="userContext-icon"></xul:hbox>
          <xul:label flex="1" crop="end" inherits="text=containerName,highlightable"></xul:label>
        </xul:hbox>
        <xul:hbox flex="1" align="right">
          <xul:button anonid="preferencesButton" label="FROM-DTD-preferencesButton-label" inherits="value=userContextId" oncommand="gContainersPane.onPreferenceCommand(event.originalTarget)"></xul:button>
          <xul:button anonid="removeButton" label="FROM-DTD-removeButton-label" inherits="value=userContextId" oncommand="gContainersPane.onRemoveCommand(event.originalTarget)"></xul:button>
        </xul:hbox>
      </xul:hbox>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}