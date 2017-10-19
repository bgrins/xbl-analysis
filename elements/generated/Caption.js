class FirefoxCaption extends FirefoxBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:image class="caption-icon" inherits="src=image">
</xul:image>
<xul:label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey">
</xul:label>
</children>`;
    let comment = document.createComment("Creating firefox-caption");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-caption", FirefoxCaption);
