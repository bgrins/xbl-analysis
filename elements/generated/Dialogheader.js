class FirefoxDialogheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<firefox-text-label class="dialogheader-title" inherits="value=title,crop" crop="right" flex="1">
</firefox-text-label>
<firefox-text-label class="dialogheader-description" inherits="value=description">
</firefox-text-label>`;
    let comment = document.createComment("Creating firefox-dialogheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-dialogheader", FirefoxDialogheader);
