class FirefoxViewbutton extends FirefoxRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="viewButtonIcon" inherits="src">
</image>
<firefox-text-label class="viewButtonLabel" inherits="value=label">
</firefox-text-label>`;
    let comment = document.createComment("Creating firefox-viewbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-viewbutton", FirefoxViewbutton);
