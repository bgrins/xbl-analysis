class FirefoxAutocompleteTree extends FirefoxTree {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <children includes="treecols"></children>
      <xul:treerows class="autocomplete-treerows tree-rows" inherits="hidescrollbar" flex="1">
        <children></children>
      </xul:treerows>
    `;
  }
}
customElements.define("firefox-autocomplete-tree", FirefoxAutocompleteTree);
