class XblTabBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-tab-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tab-base", XblTabBase);
