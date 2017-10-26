class FirefoxAutocompleteBasePopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "mInput", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mInput;
        return (this.mInput = null);
      },
      set(val) {
        delete this.mInput;
        return (this.mInput = val);
      }
    });
    Object.defineProperty(this, "mPopupOpen", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPopupOpen;
        return (this.mPopupOpen = false);
      },
      set(val) {
        delete this.mPopupOpen;
        return (this.mPopupOpen = val);
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
      },
      set(val) {
        delete this._normalMaxRows;
        return (this._normalMaxRows = val);
      }
    });

    this.addEventListener("popupshowing", event => {
      // If normalMaxRows wasn't already set by the input, then set it here
      // so that we restore the correct number when the popup is hidden.

      // Null-check this.mInput; see bug 1017914
      if (this._normalMaxRows < 0 && this.mInput) {
        this._normalMaxRows = this.mInput.maxRows;
      }

      // Set an attribute for styling the popup based on the input.
      let inputID = "";
      if (
        this.mInput &&
        this.mInput.ownerDocument &&
        this.mInput.ownerDocument.documentURIObject.schemeIs("chrome")
      ) {
        inputID = this.mInput.id;
        // Take care of elements with no id that are inside xbl bindings
        if (!inputID) {
          let bindingParent = this.mInput.ownerDocument.getBindingParent(
            this.mInput
          );
          if (bindingParent) {
            inputID = bindingParent.id;
          }
        }
      }
      this.setAttribute("autocompleteinput", inputID);

      this.mPopupOpen = true;
    });

    this.addEventListener("popuphiding", event => {
      var isListActive = true;
      if (this.selectedIndex == -1) isListActive = false;
      var controller = this.view.QueryInterface(
        Components.interfaces.nsIAutoCompleteController
      );
      controller.stopSearch();

      this.removeAttribute("autocompleteinput");
      this.mPopupOpen = false;

      // Reset the maxRows property to the cached "normal" value (if there's
      // any), and reset normalMaxRows so that we can detect whether it was set
      // by the input when the popupshowing handler runs.

      // Null-check this.mInput; see bug 1017914
      if (this.mInput && this._normalMaxRows > 0) {
        this.mInput.maxRows = this._normalMaxRows;
      }
      this._normalMaxRows = -1;
      // If the list was being navigated and then closed, make sure
      // we fire accessible focus event back to textbox

      // Null-check this.mInput; see bug 1017914
      if (isListActive && this.mInput) {
        this.mInput.mIgnoreFocus = true;
        this.mInput._focus();
        this.mInput.mIgnoreFocus = false;
      }
    });
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
