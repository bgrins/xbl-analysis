class FirefoxToolbarbuttonDropdown extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="menubar-left" inherits="src=image">
</xul:image>
<xul:label class="menubar-text" inherits="value=label,accesskey,crop" crop="right">
</xul:label>
<xul:hbox class="menubar-right">
</xul:hbox>
<children includes="menupopup">
</children>`;
    let comment = document.createComment(
      "Creating firefox-toolbarbutton-dropdown"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-toolbarbutton-dropdown",
  FirefoxToolbarbuttonDropdown
);
