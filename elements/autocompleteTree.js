class XblAutocompleteTree extends XblTree {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="treecols">
</children>
<treerows class="autocomplete-treerows tree-rows" xbl:inherits="hidescrollbar" flex="1">
<children>
</children>
</treerows>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-tree ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-tree", XblAutocompleteTree);
