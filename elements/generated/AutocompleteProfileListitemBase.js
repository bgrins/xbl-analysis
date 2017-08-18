class XblAutocompleteProfileListitemBase extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-autocomplete-profile-listitem-base"
    );
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}

  get _stringBundle() {
    /* global Services */
    if (!this.__stringBundle) {
      this.__stringBundle = Services.strings.createBundle(
        "chrome://formautofill/locale/formautofill.properties"
      );
    }
    return this.__stringBundle;
  }
  _cleanup() {
    this.removeAttribute("formautofillattached");
    if (this._itemBox) {
      this._itemBox.removeAttribute("size");
    }
  }
  _onChanged() {}
  _onOverflow() {}
  _onUnderflow() {}
  handleOverUnderflow() {}
  _adjustAutofillItemLayout() {
    let outerBoxRect = this.parentNode.getBoundingClientRect();

    // Make item fit in popup as XUL box could not constrain
    // item's width
    this._itemBox.style.width = outerBoxRect.width + "px";
    // Use two-lines layout when width is smaller than 150px
    if (outerBoxRect.width <= 150) {
      this._itemBox.setAttribute("size", "small");
    } else {
      this._itemBox.removeAttribute("size");
    }
  }
}
customElements.define(
  "xbl-autocomplete-profile-listitem-base",
  XblAutocompleteProfileListitemBase
);
