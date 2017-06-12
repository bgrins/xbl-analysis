class XblListrows extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-listrows");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listrows", XblListrows);
