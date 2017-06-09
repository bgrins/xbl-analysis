class XblRootElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-root-element ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-root-element", XblRootElement);
