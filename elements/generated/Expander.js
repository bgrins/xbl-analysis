class XblExpander extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox align="center">
<button type="disclosure" class="expanderButton" anonid="disclosure" xbl:inherits="disabled" mousethrough="always">
</button>
<label class="header expanderButton" anonid="label" xbl:inherits="value=label,disabled" mousethrough="always" flex="1">
</label>
<button anonid="clear-button" xbl:inherits="label=clearlabel,disabled=cleardisabled,hidden=clearhidden" mousethrough="always" icon="clear">
</button>
</hbox>
<vbox flex="1" anonid="settings" class="settingsContainer" collapsed="true" xbl:inherits="align">
<children>
</children>
</vbox>`;
    let comment = document.createComment("Creating xbl-expander");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-expander", XblExpander);
