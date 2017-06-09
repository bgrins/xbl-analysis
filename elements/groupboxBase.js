class XblGroupboxBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-groupbox-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox-base", XblGroupboxBase);
