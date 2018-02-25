class FirefoxListboxBase extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()

    this._lastKeyTime = 0;

    this._incrementalString = "";

    this.selectedItems = new ChromeNodeList();

    this._suppressOnSelect = false;

    this._userSelecting = false;

    this._mayReverse = false;

    this._selectTimeout = null;

    this._currentItem = null;

    this._selectionStart = null;

    this._setupEventListeners();
  }
  /**
   * nsIDOMXULSelectControlElement
   */
  set selectedItem(val) {
    this.selectItem(val);
  }

  get selectedItem() {
    return this.selectedItems.length > 0 ? this.selectedItems[0] : null;
  }

  set selectedIndex(val) {
    if (val >= 0) {
      // This is a micro-optimization so that a call to getIndexOfItem or
      // getItemAtIndex caused by _fireOnSelect (especially for derived
      // widgets) won't loop the children.
      this._selecting = {
        item: this.getItemAtIndex(val),
        index: val
      };
      this.selectItem(this._selecting.item);
      delete this._selecting;
    } else {
      this.clearSelection();
      this.currentItem = null;
    }
  }

  get selectedIndex() {
    if (this.selectedItems.length > 0)
      return this.getIndexOfItem(this.selectedItems[0]);
    return -1;
  }

  set value(val) {
    var kids = this.getElementsByAttribute("value", val);
    if (kids && kids.item(0))
      this.selectItem(kids[0]);
    return val;
  }

  get value() {
    if (this.selectedItems.length > 0)
      return this.selectedItem.value;
    return null;
  }
  /**
   * nsIDOMXULMultiSelectControlElement
   */
  set selType(val) {
    this.setAttribute('seltype', val);
    return val;
  }

  get selType() {
    return this.getAttribute('seltype');
  }

  set currentItem(val) {
    if (this._currentItem == val)
      return val;

    if (this._currentItem)
      this._currentItem.current = false;
    this._currentItem = val;

    if (val)
      val.current = true;

    return val;
  }

  get currentItem() {
    return this._currentItem;
  }

  set currentIndex(val) {
    if (val >= 0)
      this.currentItem = this.getItemAtIndex(val);
    else
      this.currentItem = null;
  }

  get currentIndex() {
    return this.currentItem ? this.getIndexOfItem(this.currentItem) : -1;
  }

  get selectedCount() {
    return this.selectedItems.length;
  }
  /**
   * Other public members
   */
  set disableKeyNavigation(val) {
    if (val)
      this.setAttribute("disableKeyNavigation", "true");
    else
      this.removeAttribute("disableKeyNavigation");
    return val;
  }

  get disableKeyNavigation() {
    return this.hasAttribute('disableKeyNavigation');
  }

  set suppressOnSelect(val) {
    this.setAttribute('suppressonselect', val);
  }

  get suppressOnSelect() {
    return this.getAttribute('suppressonselect') == 'true';
  }

  set _selectDelay(val) {
    this.setAttribute('_selectDelay', val);
  }

  get _selectDelay() {
    return this.getAttribute('_selectDelay') || 50;
  }

  removeItemAt(index) {
    var remove = this.getItemAtIndex(index);
    if (remove)
      this.removeChild(remove);
    return remove;
  }

  addItemToSelection(aItem) {
    if (this.selType != "multiple" && this.selectedCount)
      return;

    if (aItem.selected)
      return;

    this.selectedItems.append(aItem);
    aItem.selected = true;

    this._fireOnSelect();
  }

  removeItemFromSelection(aItem) {
    if (!aItem.selected)
      return;

    this.selectedItems.remove(aItem);
    aItem.selected = false;
    this._fireOnSelect();
  }

  toggleItemSelection(aItem) {
    if (aItem.selected)
      this.removeItemFromSelection(aItem);
    else
      this.addItemToSelection(aItem);
  }

  selectItem(aItem) {
    if (!aItem)
      return;

    if (this.selectedItems.length == 1 && this.selectedItems[0] == aItem)
      return;

    this._selectionStart = null;

    var suppress = this._suppressOnSelect;
    this._suppressOnSelect = true;

    this.clearSelection();
    this.addItemToSelection(aItem);
    this.currentItem = aItem;

    this._suppressOnSelect = suppress;
    this._fireOnSelect();
  }

  selectItemRange(aStartItem, aEndItem) {
    if (this.selType != "multiple")
      return;

    if (!aStartItem)
      aStartItem = this._selectionStart ?
      this._selectionStart : this.currentItem;

    if (!aStartItem)
      aStartItem = aEndItem;

    var suppressSelect = this._suppressOnSelect;
    this._suppressOnSelect = true;

    this._selectionStart = aStartItem;

    var currentItem;
    var startIndex = this.getIndexOfItem(aStartItem);
    var endIndex = this.getIndexOfItem(aEndItem);
    if (endIndex < startIndex) {
      currentItem = aEndItem;
      aEndItem = aStartItem;
      aStartItem = currentItem;
    } else {
      currentItem = aStartItem;
    }

    while (currentItem) {
      this.addItemToSelection(currentItem);
      if (currentItem == aEndItem) {
        currentItem = this.getNextItem(currentItem, 1);
        break;
      }
      currentItem = this.getNextItem(currentItem, 1);
    }

    // Clear around new selection
    // Don't use clearSelection() because it causes a lot of noise
    // with respect to selection removed notifications used by the
    // accessibility API support.
    var userSelecting = this._userSelecting;
    this._userSelecting = false; // that's US automatically unselecting
    for (; currentItem; currentItem = this.getNextItem(currentItem, 1))
      this.removeItemFromSelection(currentItem);

    for (currentItem = this.getItemAtIndex(0); currentItem != aStartItem; currentItem = this.getNextItem(currentItem, 1))
      this.removeItemFromSelection(currentItem);
    this._userSelecting = userSelecting;

    this._suppressOnSelect = suppressSelect;

    this._fireOnSelect();
  }

  selectAll() {
    this._selectionStart = null;

    var suppress = this._suppressOnSelect;
    this._suppressOnSelect = true;

    var item = this.getItemAtIndex(0);
    while (item) {
      this.addItemToSelection(item);
      item = this.getNextItem(item, 1);
    }

    this._suppressOnSelect = suppress;
    this._fireOnSelect();
  }

  invertSelection() {
    this._selectionStart = null;

    var suppress = this._suppressOnSelect;
    this._suppressOnSelect = true;

    var item = this.getItemAtIndex(0);
    while (item) {
      if (item.selected)
        this.removeItemFromSelection(item);
      else
        this.addItemToSelection(item);
      item = this.getNextItem(item, 1);
    }

    this._suppressOnSelect = suppress;
    this._fireOnSelect();
  }

  clearSelection() {
    if (this.selectedItems) {
      while (this.selectedItems.length > 0) {
        let item = this.selectedItems[0];
        item.selected = false;
        this.selectedItems.remove(item);
      }
    }

    this._selectionStart = null;
    this._fireOnSelect();
  }

  getSelectedItem(aIndex) {
    return aIndex < this.selectedItems.length ?
      this.selectedItems[aIndex] : null;
  }

  timedSelect(aItem, aTimeout) {
    var suppress = this._suppressOnSelect;
    if (aTimeout != -1)
      this._suppressOnSelect = true;

    this.selectItem(aItem);

    this._suppressOnSelect = suppress;

    if (aTimeout != -1) {
      if (this._selectTimeout)
        window.clearTimeout(this._selectTimeout);
      this._selectTimeout =
        window.setTimeout(this._selectTimeoutHandler, aTimeout, this);
    }
  }

  moveByOffset(aOffset, aIsSelecting, aIsSelectingRange) {
    if ((aIsSelectingRange || !aIsSelecting) &&
      this.selType != "multiple")
      return;

    var newIndex = this.currentIndex + aOffset;
    if (newIndex < 0)
      newIndex = 0;

    var numItems = this.getRowCount();
    if (newIndex > numItems - 1)
      newIndex = numItems - 1;

    var newItem = this.getItemAtIndex(newIndex);
    // make sure that the item is actually visible/selectable
    if (this._userSelecting && newItem && !this._canUserSelect(newItem))
      newItem =
      aOffset > 0 ? this.getNextItem(newItem, 1) || this.getPreviousItem(newItem, 1) :
      this.getPreviousItem(newItem, 1) || this.getNextItem(newItem, 1);
    if (newItem) {
      this.ensureIndexIsVisible(this.getIndexOfItem(newItem));
      if (aIsSelectingRange)
        this.selectItemRange(null, newItem);
      else if (aIsSelecting)
        this.selectItem(newItem);

      this.currentItem = newItem;
    }
  }

  /**
   * Private
   */
  getNextItem(aStartItem, aDelta) {
    while (aStartItem) {
      aStartItem = aStartItem.nextSibling;
      if (aStartItem && aStartItem instanceof Components.interfaces.nsIDOMXULSelectControlItemElement &&
        (!this._userSelecting || this._canUserSelect(aStartItem))) {
        --aDelta;
        if (aDelta == 0)
          return aStartItem;
      }
    }
    return null;
  }

  getPreviousItem(aStartItem, aDelta) {
    while (aStartItem) {
      aStartItem = aStartItem.previousSibling;
      if (aStartItem && aStartItem instanceof Components.interfaces.nsIDOMXULSelectControlItemElement &&
        (!this._userSelecting || this._canUserSelect(aStartItem))) {
        --aDelta;
        if (aDelta == 0)
          return aStartItem;
      }
    }
    return null;
  }

  _moveByOffsetFromUserEvent(aOffset, aEvent) {
    if (!aEvent.defaultPrevented) {
      this._userSelecting = true;
      this._mayReverse = true;
      this.moveByOffset(aOffset, !aEvent.ctrlKey, aEvent.shiftKey);
      this._userSelecting = false;
      this._mayReverse = false;
      aEvent.preventDefault();
    }
  }

  _canUserSelect(aItem) {
    var style = document.defaultView.getComputedStyle(aItem);
    return style.display != "none" && style.visibility == "visible";
  }

  _selectTimeoutHandler(aMe) {
    aMe._fireOnSelect();
    aMe._selectTimeout = null;
  }

  _setupEventListeners() {
    this.addEventListener("keypress", (event) => { this._moveByOffsetFromUserEvent(-1, event); });

    this.addEventListener("keypress", (event) => { this._moveByOffsetFromUserEvent(1, event); });

    this.addEventListener("keypress", (event) => {
      this._mayReverse = true;
      this._moveByOffsetFromUserEvent(-this.currentIndex, event);
      this._mayReverse = false;
    });

    this.addEventListener("keypress", (event) => {
      this._mayReverse = true;
      this._moveByOffsetFromUserEvent(this.getRowCount() - this.currentIndex - 1, event);
      this._mayReverse = false;
    });

    this.addEventListener("keypress", (event) => {
      this._mayReverse = true;
      this._moveByOffsetFromUserEvent(this.scrollOnePage(-1), event);
      this._mayReverse = false;
    });

    this.addEventListener("keypress", (event) => {
      this._mayReverse = true;
      this._moveByOffsetFromUserEvent(this.scrollOnePage(1), event);
      this._mayReverse = false;
    });

    this.addEventListener("keypress", (event) => {
      if (this.currentItem && this.selType == "multiple")
        this.toggleItemSelection(this.currentItem);
    });

    this.addEventListener("focus", (event) => {
      if (this.getRowCount() > 0) {
        if (this.currentIndex == -1) {
          this.currentIndex = this.getIndexOfFirstVisibleRow();
        } else {
          this.currentItem._fireEvent("DOMMenuItemActive");
        }
      }
      this._lastKeyTime = 0;
    });

    this.addEventListener("keypress", (event) => {
      if (this.disableKeyNavigation || !event.charCode ||
        event.altKey || event.ctrlKey || event.metaKey)
        return;

      if (event.timeStamp - this._lastKeyTime > 1000)
        this._incrementalString = "";

      var key = String.fromCharCode(event.charCode).toLowerCase();
      this._incrementalString += key;
      this._lastKeyTime = event.timeStamp;

      // If all letters in the incremental string are the same, just
      // try to match the first one
      var incrementalString = /^(.)\1+$/.test(this._incrementalString) ?
        RegExp.$1 : this._incrementalString;
      var length = incrementalString.length;

      var rowCount = this.getRowCount();
      var l = this.selectedItems.length;
      var start = l > 0 ? this.getIndexOfItem(this.selectedItems[l - 1]) : -1;
      // start from the first element if none was selected or from the one
      // following the selected one if it's a new or a repeated-letter search
      if (start == -1 || length == 1)
        start++;

      for (var i = 0; i < rowCount; i++) {
        var k = (start + i) % rowCount;
        var listitem = this.getItemAtIndex(k);
        if (!this._canUserSelect(listitem))
          continue;
        // allow richlistitems to specify the string being searched for
        var searchText = "searchLabel" in listitem ? listitem.searchLabel :
          listitem.getAttribute("label"); // (see also bug 250123)
        searchText = searchText.substring(0, length).toLowerCase();
        if (searchText == incrementalString) {
          this.ensureIndexIsVisible(k);
          this.timedSelect(listitem, this._selectDelay);
          break;
        }
      }
    });

  }
}