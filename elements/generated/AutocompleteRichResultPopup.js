class XblAutocompleteRichResultPopup extends XblAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<richlistbox anonid="richlistbox" class="autocomplete-richlistbox" flex="1">
</richlistbox>
<hbox>
<children>
</children>
</hbox>`;
    let comment = document.createComment(
      "Creating xbl-autocomplete-rich-result-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selectedIndex() {
    return this.richlistbox.selectedIndex;
  }

  get siteIconStart() {
    return this._siteIconStart;
  }

  get overflowPadding() {
    return Number(this.getAttribute("overflowpadding"));
  }

  set view(val) {
    return val;
  }

  get view() {
    return this.mInput.controller;
  }
}
customElements.define(
  "xbl-autocomplete-rich-result-popup",
  XblAutocompleteRichResultPopup
);
