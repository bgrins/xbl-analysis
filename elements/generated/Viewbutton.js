class FirefoxViewbutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:image class="viewButtonIcon" inherits="src">
</xul:image>
<xul:label class="viewButtonLabel" inherits="value=label">
</xul:label>`;
  }
}
customElements.define("firefox-viewbutton", FirefoxViewbutton);
