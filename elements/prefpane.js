class XblPrefpane extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox class="content-box" xbl:inherits="flex">
<children>
</children>
</vbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-prefpane ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-prefpane", XblPrefpane);
