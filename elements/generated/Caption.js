class FirefoxCaption extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="caption-icon" inherits="src=image">
</image>
<firefox-text-label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey">
</firefox-text-label>
</children>`;
    let comment = document.createComment("Creating firefox-caption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-caption", FirefoxCaption);
