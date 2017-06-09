class XblAutocompleteTreerows extends HTMLElement {
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
    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-treerows ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-treerows", XblAutocompleteTreerows);
