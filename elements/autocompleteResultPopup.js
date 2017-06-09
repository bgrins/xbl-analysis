class XblAutocompleteResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

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
}
customElements.define(
  "xbl-autocomplete-result-popup",
  XblAutocompleteResultPopup
);
