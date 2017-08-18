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

    Object.defineProperty(this, "mInput", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mInput;
        return (this.mInput = null);
      }
    });
    Object.defineProperty(this, "mPopupOpen", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPopupOpen;
        return (this.mPopupOpen = false);
      }
    });
    Object.defineProperty(this, "mIsPopupHidingTick", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mIsPopupHidingTick;
        return (this.mIsPopupHidingTick = false);
      }
    });
    Object.defineProperty(this, "defaultMaxRows", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.defaultMaxRows;
        return (this.defaultMaxRows = 6);
      }
    });
    Object.defineProperty(this, "_normalMaxRows", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._normalMaxRows;
        return (this._normalMaxRows = -1);
      }
    });
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
