class FirefoxStatusbar extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <children></children>
      <xul:statusbarpanel class="statusbar-resizerpanel">
        <xul:resizer dir="bottomend"></xul:resizer>
      </xul:statusbarpanel>
    `;
  }
}
customElements.define("firefox-statusbar", FirefoxStatusbar);
