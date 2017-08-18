class FirefoxAutocompleteBasePopup extends FirefoxPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-autocomplete-base-popup"
    );
    this.prepend(comment);

    this.mInput = null;
    this.mPopupOpen = false;
    this.mIsPopupHidingTick = false;
    this._normalMaxRows = -1;
  }
  disconnectedCallback() {}

  get defaultMaxRows() {
    return 6;
  }

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

  get maxRows() {
    return (this.mInput && this.mInput.maxRows) || this.defaultMaxRows;
  }
  closePopup() {
    if (this.mPopupOpen) {
      this.hidePopup();
      this.removeAttribute("width");
    }
  }
  getNextIndex(aReverse, aAmount, aIndex, aMaxRow) {
    if (aMaxRow < 0) return -1;

    var newIdx = aIndex + (aReverse ? -1 : 1) * aAmount;
    if ((aReverse && aIndex == -1) || (newIdx > aMaxRow && aIndex != aMaxRow))
      newIdx = aMaxRow;
    else if ((!aReverse && aIndex == -1) || (newIdx < 0 && aIndex != 0))
      newIdx = 0;

    if ((newIdx < 0 && aIndex == 0) || (newIdx > aMaxRow && aIndex == aMaxRow))
      aIndex = -1;
    else aIndex = newIdx;

    return aIndex;
  }
  onPopupClick(aEvent) {
    var controller = this.view.QueryInterface(
      Components.interfaces.nsIAutoCompleteController
    );
    controller.handleEnter(true, aEvent);
  }
}
customElements.define(
  "firefox-autocomplete-base-popup",
  FirefoxAutocompleteBasePopup
);
