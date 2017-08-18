class FirefoxContainer extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1" equalsize="always">
<hbox flex="1" align="center">
<hbox inherits="data-identity-icon=containerIcon,data-identity-color=containerColor" height="24" width="24" class="userContext-icon">
</hbox>
<firefox-text-label flex="1" crop="end" inherits="text=containerName,highlightable">
</firefox-text-label>
</hbox>
<hbox flex="1" align="right">
<button anonid="preferencesButton" label="&preferencesButton.label;" inherits="value=userContextId" onclick="gContainersPane.onPreferenceClick(event.originalTarget)">
</button>
<button anonid="removeButton" label="&removeButton.label;" inherits="value=userContextId" onclick="gContainersPane.onRemoveClick(event.originalTarget)">
</button>
</hbox>
</hbox>`;
    let comment = document.createComment("Creating firefox-container");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-container", FirefoxContainer);
