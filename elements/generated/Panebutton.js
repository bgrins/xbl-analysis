class FirefoxPanebutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="paneButtonIcon" inherits="src"></xul:image>
      <xul:label class="paneButtonLabel" inherits="value=label"></xul:label>
    `;
  }
}
customElements.define("firefox-panebutton", FirefoxPanebutton);
