class XblAutocompleteResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-result-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-result-popup",
  XblAutocompleteResultPopup
);
