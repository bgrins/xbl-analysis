class FirefoxAutocompleteCreditcardInsecureField extends FirefoxAutocompleteProfileListitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <div anonid="autofill-item-box" class="autofill-insecure-item"></div>
    `;

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-item-box"
    );

    this._adjustAcItem();

  }

  set selected(val) {
    // Make this item unselectable since we see this item as a pure message.
    return false;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }
  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let value = this.getAttribute("ac-value");
    this._itemBox.textContent = value;
  }
}