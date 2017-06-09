class XblBrowser extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-browser ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-browser", XblBrowser);
