class FirefoxStatusbarpanelIconicText extends FirefoxStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="statusbarpanel-icon" inherits="src,src=image">
</xul:image>
<xul:label class="statusbarpanel-text" inherits="value=label,crop">
</xul:label>`;
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-statusbarpanel-iconic-text",
  FirefoxStatusbarpanelIconicText
);
