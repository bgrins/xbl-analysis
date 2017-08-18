class XblToolbarbuttonDropdown extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="menubar-left" inherits="src=image">
</image>
<xbl-text-label class="menubar-text" inherits="value=label,accesskey,crop" crop="right">
</xbl-text-label>
<hbox class="menubar-right">
</hbox>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-toolbarbutton-dropdown");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-dropdown", XblToolbarbuttonDropdown);
