class XblExpander extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<hbox align="center">
<button type="disclosure" class="expanderButton" anonid="disclosure" inherits="disabled" mousethrough="always">
</button>
<xbl-text-label class="header expanderButton" anonid="label" inherits="value=label,disabled" mousethrough="always" flex="1">
</xbl-text-label>
<button anonid="clear-button" inherits="label=clearlabel,disabled=cleardisabled,hidden=clearhidden" mousethrough="always" icon="clear">
</button>
</hbox>
<vbox flex="1" anonid="settings" class="settingsContainer" collapsed="true" inherits="align">
<children>
</children>
</vbox>`;
    let comment = document.createComment("Creating xbl-expander");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-expander", XblExpander);
