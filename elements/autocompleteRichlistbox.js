class XblAutocompleteRichlistbox extends XblRichlistbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-richlistbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistbox",
  XblAutocompleteRichlistbox
);
