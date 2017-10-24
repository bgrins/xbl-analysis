class FirefoxToolbarbuttonBadgedMenu extends FirefoxToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<xul:stack class="toolbarbutton-badge-stack">
<xul:image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</xul:image>
<xul:label class="toolbarbutton-badge" inherits="value=badge" top="0" end="0" crop="none">
</xul:label>
</xul:stack>
<xul:label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,dragover-top,wrap">
</xul:label>
<xul:label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xul:label>
<xul:dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label">
</xul:dropmarker>`;
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-toolbarbutton-badged-menu",
  FirefoxToolbarbuttonBadgedMenu
);
