class XblSplitter extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-splitter ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-splitter", XblSplitter);
