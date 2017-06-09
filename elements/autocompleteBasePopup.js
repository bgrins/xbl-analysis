class XblAutocompleteBasePopup extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment(
      "Creating xbl-autocomplete-base-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-base-popup", XblAutocompleteBasePopup);
