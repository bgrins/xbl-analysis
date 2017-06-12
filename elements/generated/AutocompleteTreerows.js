class XblAutocompleteTreerows extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox flex="1" class="tree-bodybox">
<children>
</children>
</hbox>
<scrollbar xbl:inherits="collapsed=hidescrollbar" orient="vertical" class="tree-scrollbar">
</scrollbar>`;
    let comment = document.createComment("Creating xbl-autocomplete-treerows");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-treerows", XblAutocompleteTreerows);
