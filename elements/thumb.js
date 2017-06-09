class XblThumb extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-thumb ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-thumb", XblThumb);
