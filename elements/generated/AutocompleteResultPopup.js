class XblAutocompleteResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<tree anonid="tree" class="autocomplete-tree plain" hidecolumnpicker="true" flex="1" seltype="single">
<treecols anonid="treecols">
<treecol id="treecolAutoCompleteValue" class="autocomplete-treecol" flex="1" overflow="true">
</treecol>
</treecols>
<treechildren class="autocomplete-treebody">
</treechildren>
</tree>`;
    let comment = document.createComment(
      "Creating xbl-autocomplete-result-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get showCommentColumn() {
    return this.mShowCommentColumn;
  }

  get showImageColumn() {
    return this.mShowImageColumn;
  }

  get selectedIndex() {
    return this.tree.currentIndex;
  }

  get view() {
    return this.mView;
  }
}
customElements.define(
  "xbl-autocomplete-result-popup",
  XblAutocompleteResultPopup
);
