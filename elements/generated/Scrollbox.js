class FirefoxScrollbox extends FirefoxScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
<children>
</children>
</xul:box>`;
  }

  scrollByIndex(index) {
    this.boxObject.scrollByIndex(index);
  }
}
customElements.define("firefox-scrollbox", FirefoxScrollbox);
