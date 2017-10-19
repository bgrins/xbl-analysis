class FirefoxAutocompleteTree extends FirefoxTree {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="treecols">
</children>
<xul:treerows class="autocomplete-treerows tree-rows" inherits="hidescrollbar" flex="1">
<children>
</children>
</xul:treerows>`;
    let comment = document.createComment("Creating firefox-autocomplete-tree");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-autocomplete-tree", FirefoxAutocompleteTree);
