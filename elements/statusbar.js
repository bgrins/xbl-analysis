class XblStatusbar extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>
<statusbarpanel class="statusbar-resizerpanel">
<resizer dir="bottomend">
</resizer>
</statusbarpanel>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-statusbar ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbar", XblStatusbar);
