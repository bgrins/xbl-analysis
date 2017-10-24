class FirefoxCaption extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children>
<xul:image class="caption-icon" inherits="src=image">
</xul:image>
<xul:label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey">
</xul:label>
</children>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-caption", FirefoxCaption);
