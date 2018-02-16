class FirefoxListbox extends FirefoxListboxBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children includes="listcols">
        <xul:listcols>
          <xul:listcol flex="1"></xul:listcol>
        </xul:listcols>
      </children>
      <xul:listrows>
        <children includes="listhead"></children>
        <xul:listboxbody inherits="rows,size,minheight">
          <children includes="listitem"></children>
        </xul:listboxbody>
      </xul:listrows>
    `;

    this._touchY = -1;

    var count = this.itemCount;
    for (var index = 0; index < count; index++) {
      var item = this.getItemAtIndex(index);
      if (item.getAttribute("selected") == "true")
        this.selectedItems.append(item);
    }

    this.setupHandlers();
  }

  get listBoxObject() {
    return this.boxObject;
  }

  get itemCount() {
    return this.listBoxObject.getRowCount()
  }
  _fireOnSelect() {
    if (!this._suppressOnSelect && !this.suppressOnSelect) {
      var event = document.createEvent("Events");
      event.initEvent("select", true, true);
      this.dispatchEvent(event);
    }
  }
  appendItem(aLabel, aValue) {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    var item = this.ownerDocument.createElementNS(XULNS, "listitem");
    item.setAttribute("label", aLabel);
    item.setAttribute("value", aValue);
    this.appendChild(item);
    return item;
  }
  insertItemAt(aIndex, aLabel, aValue) {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    var item = this.ownerDocument.createElementNS(XULNS, "listitem");
    item.setAttribute("label", aLabel);
    item.setAttribute("value", aValue);
    var before = this.getItemAtIndex(aIndex);
    if (before)
      this.insertBefore(item, before);
    else
      this.appendChild(item);
    return item;
  }
  getIndexOfItem(item) {
    if (this._selecting && this._selecting.item == item)
      return this._selecting.index;
    return this.listBoxObject.getIndexOfItem(item);
  }
  getItemAtIndex(index) {
    if (this._selecting && this._selecting.index == index)
      return this._selecting.item;
    return this.listBoxObject.getItemAtIndex(index);
  }
  ensureIndexIsVisible(index) {
    return this.listBoxObject.ensureIndexIsVisible(index);
  }
  ensureElementIsVisible(element) {
    return this.ensureIndexIsVisible(this.listBoxObject.getIndexOfItem(element));
  }
  scrollToIndex(index) {
    return this.listBoxObject.scrollToIndex(index);
  }
  getNumberOfVisibleRows() {
    return this.listBoxObject.getNumberOfVisibleRows();
  }
  getIndexOfFirstVisibleRow() {
    return this.listBoxObject.getIndexOfFirstVisibleRow();
  }
  getRowCount() {
    return this.listBoxObject.getRowCount();
  }
  scrollOnePage(direction) {
    var pageOffset = this.getNumberOfVisibleRows() * direction;
    // skip over invisible elements - the user won't care about them
    for (var i = 0; i != pageOffset; i += direction) {
      var item = this.getItemAtIndex(this.currentIndex + i);
      if (item && !this._canUserSelect(item))
        pageOffset += direction;
    }
    var newTop = this.getIndexOfFirstVisibleRow() + pageOffset;
    if (direction == 1) {
      var maxTop = this.getRowCount() - this.getNumberOfVisibleRows();
      for (i = this.getRowCount(); i >= 0 && i > maxTop; i--) {
        item = this.getItemAtIndex(i);
        if (item && !this._canUserSelect(item))
          maxTop--;
      }
      if (newTop >= maxTop)
        newTop = maxTop;
    }
    if (newTop < 0)
      newTop = 0;
    this.scrollToIndex(newTop);
    return pageOffset;
  }

  setupHandlers() {

    this.addEventListener("keypress", (event) => {
      if (this.currentItem) {
        if (this.currentItem.getAttribute("type") != "checkbox") {
          this.addItemToSelection(this.currentItem);
          // Prevent page from scrolling on the space key.
          event.preventDefault();
        } else if (!this.currentItem.disabled) {
          this.currentItem.checked = !this.currentItem.checked;
          this.currentItem.doCommand();
          // Prevent page from scrolling on the space key.
          event.preventDefault();
        }
      }
    });

    this.addEventListener("MozSwipeGesture", (event) => {
      // Figure out which index to show
      let targetIndex = 0;

      // Only handle swipe gestures up and down
      switch (event.direction) {
        case event.DIRECTION_DOWN:
          targetIndex = this.itemCount - 1;
          // Fall through for actual action
        case event.DIRECTION_UP:
          this.ensureIndexIsVisible(targetIndex);
          break;
      }
    });

    this.addEventListener("touchstart", (event) => {
      if (event.touches.length > 1) {
        // Multiple touch points detected, abort. In particular this aborts
        // the panning gesture when the user puts a second finger down after
        // already panning with one finger. Aborting at this point prevents
        // the pan gesture from being resumed until all fingers are lifted
        // (as opposed to when the user is back down to one finger).
        this._touchY = -1;
      } else {
        this._touchY = event.touches[0].screenY;
      }
    });

    this.addEventListener("touchmove", (event) => {
      if (event.touches.length == 1 &&
        this._touchY >= 0) {
        let deltaY = this._touchY - event.touches[0].screenY;
        let lines = Math.trunc(deltaY / this.listBoxObject.getRowHeight());
        if (Math.abs(lines) > 0) {
          this.listBoxObject.scrollByLines(lines);
          deltaY -= lines * this.listBoxObject.getRowHeight();
          this._touchY = event.touches[0].screenY + deltaY;
        }
        event.preventDefault();
      }
    });

    this.addEventListener("touchend", (event) => {
      this._touchY = -1;
    });

  }
}