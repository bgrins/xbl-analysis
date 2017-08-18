class FirefoxAutocompleteCreditcardInsecureField extends FirefoxAutocompleteProfileListitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<div anonid="autofill-item-box" class="autofill-insecure-item">
</div>`;
    let comment = document.createComment(
      "Creating firefox-autocomplete-creditcard-insecure-field"
    );
    this.prepend(comment);

    try {
      this._itemBox = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "autofill-item-box"
      );

      this._adjustAcItem();
    } catch (e) {}
  }
  disconnectedCallback() {}

  set selected(val) {
    // Make this item unselectable since we see this item as a pure message.
    return false;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }
  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let value = this.getAttribute("ac-value");
    this._itemBox.textContent = value;
  }
}
customElements.define(
  "firefox-autocomplete-creditcard-insecure-field",
  FirefoxAutocompleteCreditcardInsecureField
);
