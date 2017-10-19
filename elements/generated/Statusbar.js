class FirefoxStatusbar extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<xul:statusbarpanel class="statusbar-resizerpanel">
<xul:resizer dir="bottomend">
</xul:resizer>
</xul:statusbarpanel>`;
    let comment = document.createComment("Creating firefox-statusbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-statusbar", FirefoxStatusbar);
