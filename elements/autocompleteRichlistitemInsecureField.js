class XblAutocompleteRichlistitemInsecureField extends XblAutocompleteRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-richlistitem-insecure-field";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistitem-insecure-field",
  XblAutocompleteRichlistitemInsecureField
);
