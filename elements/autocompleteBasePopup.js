class XblAutocompleteBasePopup extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-base-popup ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete-base-popup", XblAutocompleteBasePopup);
