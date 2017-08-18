class FirefoxAutocompleteTreerows extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1" class="tree-bodybox">
<children>
</children>
</hbox>
<scrollbar inherits="collapsed=hidescrollbar" orient="vertical" class="tree-scrollbar">
</scrollbar>`;
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
