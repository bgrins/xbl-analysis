class FirefoxToolbarbuttonDropdown extends FirefoxMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="menubar-left" inherits="src=image">
</image>
<firefox-text-label class="menubar-text" inherits="value=label,accesskey,crop" crop="right">
</firefox-text-label>
<hbox class="menubar-right">
</hbox>
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
