class FirefoxPanebutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="paneButtonIcon" inherits="src">
</xul:image>
<xul:label class="paneButtonLabel" inherits="value=label">
</xul:label>`;
    let comment = document.createComment("Creating firefox-panebutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-panebutton", FirefoxPanebutton);
