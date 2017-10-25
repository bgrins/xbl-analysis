class FirefoxMenulistDescription extends FirefoxMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox class="menulist-label-box" flex="1">
<xul:image class="menulist-icon" inherits="src=image,src">
</xul:image>
<xul:label class="menulist-label" inherits="value=label,crop,accesskey" crop="right" flex="1">
</xul:label>
<xul:label class="menulist-label menulist-description" inherits="value=description" crop="right" flex="10000">
</xul:label>
</xul:hbox>
<xul:dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open">
</xul:dropmarker>
<children includes="menupopup">
</children>`;
  }
}
customElements.define(
  "firefox-menulist-description",
  FirefoxMenulistDescription
);
