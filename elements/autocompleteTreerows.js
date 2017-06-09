class XblAutocompleteTreerows extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-treerows";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-treerows", XblAutocompleteTreerows);
