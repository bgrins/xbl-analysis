class XblResizer extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-resizer ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-resizer", XblResizer);
