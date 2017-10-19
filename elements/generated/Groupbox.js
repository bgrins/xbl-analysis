class FirefoxGroupbox extends FirefoxGroupboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="groupbox-title" align="center" pack="start">
<children includes="caption">
</children>
</xul:hbox>
<xul:box flex="1" class="groupbox-body" inherits="orient,align,pack">
<children>
</children>
</xul:box>`;
    let comment = document.createComment("Creating firefox-groupbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-groupbox", FirefoxGroupbox);
