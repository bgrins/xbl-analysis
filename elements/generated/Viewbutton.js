class FirefoxViewbutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:image class="viewButtonIcon" inherits="src">
</xul:image>
<xul:label class="viewButtonLabel" inherits="value=label">
</xul:label>`;
    let comment = document.createComment("Creating firefox-viewbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-viewbutton", FirefoxViewbutton);
