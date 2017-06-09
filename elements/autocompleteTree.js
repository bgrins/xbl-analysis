class XblAutocompleteTree extends XblTree {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-tree";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-tree", XblAutocompleteTree);
