class XblAutocompleteRichResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-rich-result-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-rich-result-popup",
  XblAutocompleteRichResultPopup
);
