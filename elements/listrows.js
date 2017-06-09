class XblListrows extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-listrows ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listrows", XblListrows);
