class XblAutocompleteRichResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<richlistbox anonid="richlistbox" class="autocomplete-richlistbox" flex="1">
</richlistbox>
<hbox>
<children>
</children>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete-rich-result-popup ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-rich-result-popup",
  XblAutocompleteRichResultPopup
);
