class FirefoxPanebutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="paneButtonIcon" inherits="src">
</image>
<firefox-text-label class="paneButtonLabel" inherits="value=label">
</firefox-text-label>`;
    let comment = document.createComment("Creating firefox-panebutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-panebutton", FirefoxPanebutton);
