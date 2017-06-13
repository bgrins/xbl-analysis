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
    this.richlistbox.collapsed = this._matchCount == 0;

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
    for (let i = this._matchCount; i < existingItemsCount; ++i) {
      this.richlistbox.childNodes[i].collapsed = true;
    }
  }
  adjustHeight() {
    // Figure out how many rows to show
    let rows = this.richlistbox.childNodes;
    let numRows = Math.min(this._matchCount, this.maxRows, rows.length);

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
    var matchCount = this._matchCount;
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

        originalValue = item.getAttribute("ac-value");
        originalText = item.getAttribute("ac-text");
        originalType = item.getAttribute("originaltype");

        // All of types are reusable except for autofill-profile,
        // which has different structure of <content> and overrides
        // _adjustAcItem().
        reusable =
          originalType === style ||
          (style !== "autofill-profile" && originalType !== "autofill-profile");
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

      if (typeof item._onChanged == "function") {
        // The binding may have not been applied yet.
        setTimeout(() => {
          item._onChanged();
        }, 0);
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
        this._matchCount - 1
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
  "xbl-autocomplete-rich-result-popup",
  XblAutocompleteRichResultPopup
);
