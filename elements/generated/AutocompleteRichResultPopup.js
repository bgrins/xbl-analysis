class FirefoxAutocompleteRichResultPopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:richlistbox anonid="richlistbox" class="autocomplete-richlistbox" flex="1"></xul:richlistbox>
      <xul:hbox>
        <children></children>
      </xul:hbox>
    `;
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
    Object.defineProperty(this, "_currentIndex", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._currentIndex;
        return (this._currentIndex = 0);
      },
      set(val) {
        delete this._currentIndex;
        return (this._currentIndex = val);
      }
    });
    Object.defineProperty(this, "_rlbAnimated", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._rlbAnimated;
        return (this._rlbAnimated = false);
      },
      set(val) {
        delete this._rlbAnimated;
        return (this._rlbAnimated = val);
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
    Object.defineProperty(this, "richlistbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.richlistbox;
        return (this.richlistbox = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "richlistbox"
        ));
      },
      set(val) {
        delete this.richlistbox;
        return (this.richlistbox = val);
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

    this.addEventListener("popupshown", event => {
      if (this._adjustHeightOnPopupShown) {
        delete this._adjustHeightOnPopupShown;
        this.adjustHeight();
      }
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

  set selectedIndex(val) {
    this.richlistbox.selectedIndex = val;
    // Since ensureElementIsVisible may cause an expensive Layout flush,
    // invoke it only if there may be a scrollbar, so if we could fetch
    // more results than we can show at once.
    // maxResults is the maximum number of fetched results, maxRows is the
    // maximum number of rows we show at once, without a scrollbar.
    if (this.mPopupOpen && this.maxResults > this.maxRows) {
      // when clearing the selection (val == -1, so selectedItem will be
      // null), we want to scroll back to the top.  see bug #406194
      this.richlistbox.ensureElementIsVisible(
        this.richlistbox.selectedItem || this.richlistbox.firstChild
      );
    }
    return val;
  }

  get selectedIndex() {
    return this.richlistbox.selectedIndex;
  }

  get maxResults() {
    // This is how many richlistitems will be kept around.
    // Note, this getter may be overridden, or instances
    // can have the nomaxresults attribute set to have no
    // limit.
    if (this.getAttribute("nomaxresults") == "true") {
      return Infinity;
    }

    return 20;
  }

  get matchCount() {
    return Math.min(this.mInput.controller.matchCount, this.maxResults);
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
  onSearchBegin() {
    this.richlistbox.mousedOverIndex = -1;

    if (typeof this._onSearchBegin == "function") {
      this._onSearchBegin();
    }
  }
  openAutocompletePopup(aInput, aElement) {
    // until we have "baseBinding", (see bug #373652) this allows
    // us to override openAutocompletePopup(), but still call
    // the method on the base class
    this._openAutocompletePopup(aInput, aElement);
  }
  _openAutocompletePopup(aInput, aElement) {
    if (!this.mPopupOpen) {
      // It's possible that the panel is hidden initially
      // to avoid impacting startup / new window performance
      aInput.popup.hidden = false;

      this.mInput = aInput;
      // clear any previous selection, see bugs 400671 and 488357
      this.selectedIndex = -1;

      var width = aElement.getBoundingClientRect().width;
      this.setAttribute("width", width > 100 ? width : 100);
      // invalidate() depends on the width attribute
      this._invalidate();

      this.openPopup(aElement, "after_start", 0, 0, false, false);
    }
  }
  invalidate(reason) {
    // Don't bother doing work if we're not even showing
    if (!this.mPopupOpen) return;

    this._invalidate(reason);
  }
  _invalidate(reason) {
    // collapsed if no matches
    this.richlistbox.collapsed = this.matchCount == 0;

    // Update the richlistbox height.
    if (this._adjustHeightTimeout) {
      clearTimeout(this._adjustHeightTimeout);
    }
    if (this._shrinkTimeout) {
      clearTimeout(this._shrinkTimeout);
    }

    if (this.mPopupOpen) {
      delete this._adjustHeightOnPopupShown;
      this._adjustHeightTimeout = setTimeout(() => this.adjustHeight(), 0);
    } else {
      this._adjustHeightOnPopupShown = true;
    }

    this._currentIndex = 0;
    if (this._appendResultTimeout) {
      clearTimeout(this._appendResultTimeout);
    }
    this._appendCurrentResult(reason);
  }
  _collapseUnusedItems() {
    let existingItemsCount = this.richlistbox.childNodes.length;
    for (let i = this.matchCount; i < existingItemsCount; ++i) {
      let item = this.richlistbox.childNodes[i];

      item.collapsed = true;
      if (typeof item._onCollapse == "function") {
        item._onCollapse();
      }
    }
  }
  adjustHeight() {
    // Figure out how many rows to show
    let rows = this.richlistbox.childNodes;
    let numRows = Math.min(this.matchCount, this.maxRows, rows.length);

    this.removeAttribute("height");

    // Default the height to 0 if we have no rows to show
    let height = 0;
    if (numRows) {
      let firstRowRect = rows[0].getBoundingClientRect();
      if (this._rlbPadding == undefined) {
        let style = window.getComputedStyle(this.richlistbox);

        let transition = style.transitionProperty;
        this._rlbAnimated = transition && transition != "none";

        let paddingTop = parseInt(style.paddingTop) || 0;
        let paddingBottom = parseInt(style.paddingBottom) || 0;
        this._rlbPadding = paddingTop + paddingBottom;
      }

      if (numRows > this.maxRows) {
        // Set a fixed max-height to avoid flicker when growing the panel.
        let lastVisibleRowRect = rows[this.maxRows - 1].getBoundingClientRect();
        let visibleHeight = lastVisibleRowRect.bottom - firstRowRect.top;
        this.richlistbox.style.maxHeight =
          visibleHeight + this._rlbPadding + "px";
      }

      // The class `forceHandleUnderflow` is for the item might need to
      // handle OverUnderflow or Overflow when the height of an item will
      // be changed dynamically.
      for (let i = 0; i < numRows; i++) {
        if (rows[i].classList.contains("forceHandleUnderflow")) {
          rows[i].handleOverUnderflow();
        }
      }

      let lastRowRect = rows[numRows - 1].getBoundingClientRect();
      // Calculate the height to have the first row to last row shown
      height = lastRowRect.bottom - firstRowRect.top + this._rlbPadding;
    }

    let animate =
      this._rlbAnimated && this.getAttribute("dontanimate") != "true";
    let currentHeight = this.richlistbox.getBoundingClientRect().height;
    if (height > currentHeight) {
      // Grow immediately.
      if (animate) {
        this.richlistbox.removeAttribute("height");
        this.richlistbox.style.height = height + "px";
      } else {
        this.richlistbox.style.removeProperty("height");
        this.richlistbox.height = height;
      }
    } else {
      // Delay shrinking to avoid flicker.
      this._shrinkTimeout = setTimeout(() => {
        this._collapseUnusedItems();
        if (animate) {
          this.richlistbox.removeAttribute("height");
          this.richlistbox.style.height = height + "px";
        } else {
          this.richlistbox.style.removeProperty("height");
          this.richlistbox.height = height;
        }
      }, this.mInput.shrinkDelay);
    }
  }
  _appendCurrentResult(invalidateReason) {
    var controller = this.mInput.controller;
    var matchCount = this.matchCount;
    var existingItemsCount = this.richlistbox.childNodes.length;

    // Process maxRows per chunk to improve performance and user experience
    for (let i = 0; i < this.maxRows; i++) {
      if (this._currentIndex >= matchCount) {
        break;
      }
      let item;
      let reusable = false;
      let itemExists = this._currentIndex < existingItemsCount;

      let originalValue, originalText, originalType;
      let value = controller.getValueAt(this._currentIndex);
      let label = controller.getLabelAt(this._currentIndex);
      let comment = controller.getCommentAt(this._currentIndex);
      let style = controller.getStyleAt(this._currentIndex);
      let image = controller.getImageAt(this._currentIndex);
      // trim the leading/trailing whitespace
      let trimmedSearchString = controller.searchString
        .replace(/^\s+/, "")
        .replace(/\s+$/, "");

      if (itemExists) {
        item = this.richlistbox.childNodes[this._currentIndex];

        // Url may be a modified version of value, see _adjustACItem().
        originalValue =
          item.getAttribute("url") || item.getAttribute("ac-value");
        originalText = item.getAttribute("ac-text");
        originalType = item.getAttribute("originaltype");

        // The styles on the list which have different <content> structure and overrided
        // _adjustAcItem() are unreusable.
        const UNREUSEABLE_STYLES = [
          "autofill-profile",
          "autofill-footer",
          "autofill-clear-button",
          "autofill-insecureWarning"
        ];
        // Reuse the item when its style is exactly equal to the previous style or
        // neither of their style are in the UNREUSEABLE_STYLES.
        reusable =
          originalType === style ||
          !(
            UNREUSEABLE_STYLES.includes(style) ||
            UNREUSEABLE_STYLES.includes(originalType)
          );
      } else {
        // need to create a new item
        item = document.createElementNS(
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
          "richlistitem"
        );
      }

      item.setAttribute("dir", this.style.direction);
      item.setAttribute("ac-image", image);
      item.setAttribute("ac-value", value);
      item.setAttribute("ac-label", label);
      item.setAttribute("ac-comment", comment);
      item.setAttribute("ac-text", trimmedSearchString);

      // Completely reuse the existing richlistitem for invalidation
      // due to new results, but only when: the item is the same, *OR*
      // we are about to replace the currently moused-over item, to
      // avoid surprising the user.
      let iface = Components.interfaces.nsIAutoCompletePopup;
      if (
        reusable &&
        originalText == trimmedSearchString &&
        invalidateReason == iface.INVALIDATE_REASON_NEW_RESULT &&
        (originalValue == value ||
          this.richlistbox.mousedOverIndex === this._currentIndex)
      ) {
        // try to re-use the existing item
        let reused = item._reuseAcItem();
        if (reused) {
          this._currentIndex++;
          continue;
        }
      } else {
        if (typeof item._cleanup == "function") {
          item._cleanup();
        }
        item.setAttribute("originaltype", style);
      }

      if (itemExists) {
        // Adjust only when the result's type is reusable for existing
        // item's. Otherwise, we might insensibly call old _adjustAcItem()
        // as new binding has not been attached yet.
        // We don't need to worry about switching to new binding, since
        // _adjustAcItem() will fired by its own constructor accordingly.
        if (reusable) {
          item._adjustAcItem();
        }
        item.collapsed = false;
      } else {
        // set the class at the end so we can use the attributes
        // in the xbl constructor
        item.className = "autocomplete-richlistitem";
        this.richlistbox.appendChild(item);
      }

      this._currentIndex++;
    }

    if (typeof this.onResultsAdded == "function") this.onResultsAdded();

    if (this._currentIndex < matchCount) {
      // yield after each batch of items so that typing the url bar is
      // responsive
      this._appendResultTimeout = setTimeout(
        () => this._appendCurrentResult(),
        0
      );
    }
  }
  selectBy(aReverse, aPage) {
    try {
      var amount = aPage ? 5 : 1;

      // because we collapsed unused items, we can't use this.richlistbox.getRowCount(), we need to use the matchCount
      this.selectedIndex = this.getNextIndex(
        aReverse,
        amount,
        this.selectedIndex,
        this.matchCount - 1
      );
      if (this.selectedIndex == -1) {
        this.input._focus();
      }
    } catch (ex) {
      // do nothing - occasionally timer-related js errors happen here
      // e.g. "this.selectedIndex has no properties", when you type fast and hit a
      // navigation key before this popup has opened
    }
  }
}
customElements.define(
  "firefox-autocomplete-rich-result-popup",
  FirefoxAutocompleteRichResultPopup
);
