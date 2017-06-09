class XblAutocompleteRichlistitem extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-richlistitem";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistitem",
  XblAutocompleteRichlistitem
);
