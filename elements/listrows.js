class XblListrows extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-listrows");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listrows", XblListrows);
