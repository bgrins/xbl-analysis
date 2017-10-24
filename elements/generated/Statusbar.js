class FirefoxStatusbar extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<children>
</children>
<xul:statusbarpanel class="statusbar-resizerpanel">
<xul:resizer dir="bottomend">
</xul:resizer>
</xul:statusbarpanel>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-statusbar", FirefoxStatusbar);
