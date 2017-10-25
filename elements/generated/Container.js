class FirefoxContainer extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:hbox flex="1" equalsize="always">
<xul:hbox flex="1" align="center">
<xul:hbox inherits="data-identity-icon=containerIcon,data-identity-color=containerColor" height="24" width="24" class="userContext-icon">
</xul:hbox>
<xul:label flex="1" crop="end" inherits="text=containerName,highlightable">
</xul:label>
</xul:hbox>
<xul:hbox flex="1" align="right">
<xul:button anonid="preferencesButton" label="FROM-DTD-preferencesButton-label" inherits="value=userContextId" onclick="gContainersPane.onPreferenceClick(event.originalTarget)">
</xul:button>
<xul:button anonid="removeButton" label="FROM-DTD-removeButton-label" inherits="value=userContextId" onclick="gContainersPane.onRemoveClick(event.originalTarget)">
</xul:button>
</xul:hbox>
</xul:hbox>`;
  }
}
customElements.define("firefox-container", FirefoxContainer);
