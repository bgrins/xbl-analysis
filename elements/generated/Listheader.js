class FirefoxListheader extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<image class="listheader-icon">
</image>
<firefox-text-label class="listheader-label" inherits="value=label,crop" flex="1" crop="right">
</firefox-text-label>
<image class="listheader-sortdirection" inherits="sortDirection">
</image>`;
    let comment = document.createComment("Creating firefox-listheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listheader", FirefoxListheader);
