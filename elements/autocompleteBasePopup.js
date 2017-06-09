class XblAutocompleteBasePopup extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-autocomplete-base-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-base-popup", XblAutocompleteBasePopup);
