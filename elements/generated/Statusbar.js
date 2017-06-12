class XblStatusbar extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<statusbarpanel class="statusbar-resizerpanel">
<resizer dir="bottomend">
</resizer>
</statusbarpanel>`;
    let comment = document.createComment("Creating xbl-statusbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbar", XblStatusbar);
