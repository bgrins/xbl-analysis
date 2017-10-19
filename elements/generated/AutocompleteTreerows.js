class FirefoxAutocompleteTreerows extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox flex="1" class="tree-bodybox">
<children>
</children>
</xul:hbox>
<xul:scrollbar inherits="collapsed=hidescrollbar" orient="vertical" class="tree-scrollbar">
</xul:scrollbar>`;
    let comment = document.createComment(
      "Creating firefox-autocomplete-treerows"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-autocomplete-treerows",
  FirefoxAutocompleteTreerows
);
