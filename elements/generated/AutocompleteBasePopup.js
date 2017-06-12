class XblAutocompleteBasePopup extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-autocomplete-base-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get input() {
    return this.mInput;
  }

  get overrideValue() {
    return null;
  }

  get popupOpen() {
    return this.mPopupOpen;
  }

  get isPopupHidingTick() {
    return this.mIsPopupHidingTick;
  }
}
customElements.define("xbl-autocomplete-base-popup", XblAutocompleteBasePopup);
