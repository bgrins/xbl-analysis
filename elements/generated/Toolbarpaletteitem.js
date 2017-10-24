class FirefoxToolbarpaletteitem extends FirefoxToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox class="toolbarpaletteitem-box" flex="1" inherits="type,place">
<children>
</children>
</xul:hbox>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarpaletteitem", FirefoxToolbarpaletteitem);
