class FirefoxScrollbox extends FirefoxScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
<children>
</children>
</xul:box>`;
    let comment = document.createComment("Creating firefox-scrollbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  scrollByIndex(index) {
    this.boxObject.scrollByIndex(index);
  }
}
customElements.define("firefox-scrollbox", FirefoxScrollbox);
