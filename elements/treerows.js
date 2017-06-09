class XblTreerows extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-treerows";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treerows", XblTreerows);
