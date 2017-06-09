class XblAutocompleteRichlistbox extends XblRichlistbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment(
      "Creating xbl-autocomplete-richlistbox"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistbox",
  XblAutocompleteRichlistbox
);
