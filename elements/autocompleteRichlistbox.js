class XblAutocompleteRichlistbox extends XblRichlistbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-richlistbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistbox",
  XblAutocompleteRichlistbox
);
