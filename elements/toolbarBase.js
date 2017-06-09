class XblToolbarBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbar-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar-base", XblToolbarBase);
