class FirefoxListbox extends FirefoxListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="listcols">
<listcols>
<listcol flex="1">
</listcol>
</listcols>
</children>
<listrows>
<children includes="listhead">
</children>
<listboxbody inherits="rows,size,minheight">
<children includes="listitem">
</children>
</listboxbody>
</listrows>`;
    let comment = document.createComment("Creating firefox-listbox");
    this.prepend(comment);

    Object.defineProperty(this, "_touchY", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._touchY;
        return (this._touchY = -1);
      },
      set(val) {
        delete this._touchY;
        return (this._touchY = val);
      }
    });

    try {
      var count = this.itemCount;
      for (var index = 0; index < count; index++) {
        var item = this.getItemAtIndex(index);
        if (item.getAttribute("selected") == "true")
          this.selectedItems.append(item);
      }
    } catch (e) {}
  }
  disconnectedCallback() {}

  get listBoxObject() {
    return this.boxObject;
  }

  get itemCount() {
    return this.listBoxObject.getRowCount();
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
    if (before) this.insertBefore(item, before);
    else this.appendChild(item);
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
    return this.ensureIndexIsVisible(
      this.listBoxObject.getIndexOfItem(element)
    );
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
      if (item && !this._canUserSelect(item)) pageOffset += direction;
    }
    var newTop = this.getIndexOfFirstVisibleRow() + pageOffset;
    if (direction == 1) {
      var maxTop = this.getRowCount() - this.getNumberOfVisibleRows();
      for (i = this.getRowCount(); i >= 0 && i > maxTop; i--) {
        item = this.getItemAtIndex(i);
        if (item && !this._canUserSelect(item)) maxTop--;
      }
      if (newTop >= maxTop) newTop = maxTop;
    }
    if (newTop < 0) newTop = 0;
    this.scrollToIndex(newTop);
    return pageOffset;
  }
}
customElements.define("firefox-listbox", FirefoxListbox);
