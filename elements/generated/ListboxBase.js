class XblListboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-listbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set selectedItem(val) {
    this.selectItem(val);
  }

  set selType(val) {
    this.setAttribute("seltype", val);
    return val;
  }

  get selType() {
    return this.getAttribute("seltype");
  }

  get currentItem() {
    return this._currentItem;
  }

  get selectedCount() {
    return this.selectedItems.length;
  }

  get disableKeyNavigation() {
    return this.hasAttribute("disableKeyNavigation");
  }

  set suppressOnSelect(val) {
    this.setAttribute("suppressonselect", val);
  }

  get suppressOnSelect() {
    return this.getAttribute("suppressonselect") == "true";
  }

  set _selectDelay(val) {
    this.setAttribute("_selectDelay", val);
  }

  get _selectDelay() {
    return this.getAttribute("_selectDelay") || 50;
  }
  removeItemAt(index) {
    var remove = this.getItemAtIndex(index);
    if (remove) this.removeChild(remove);
    return remove;
  }
  addItemToSelection(aItem) {
    if (this.selType != "multiple" && this.selectedCount) return;

    if (aItem.selected) return;

    this.selectedItems.append(aItem);
    aItem.selected = true;

    this._fireOnSelect();
  }
  removeItemFromSelection(aItem) {
    if (!aItem.selected) return;

    this.selectedItems.remove(aItem);
    aItem.selected = false;
    this._fireOnSelect();
  }
  toggleItemSelection(aItem) {
    if (aItem.selected) this.removeItemFromSelection(aItem);
    else this.addItemToSelection(aItem);
  }
  selectItem(aItem) {
    if (!aItem) return;

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
    if (this.selType != "multiple") return;

    if (!aStartItem)
      aStartItem = this._selectionStart
        ? this._selectionStart
        : this.currentItem;

    if (!aStartItem) aStartItem = aEndItem;

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

    for (
      currentItem = this.getItemAtIndex(0);
      currentItem != aStartItem;
      currentItem = this.getNextItem(currentItem, 1)
    )
      this.removeItemFromSelection(currentItem);
    this._userSelecting = userSelecting;

    this._suppressOnSelect = suppressSelect;

    this._fireOnSelect();
  }
  selectAll() {}
  invertSelection() {}
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
    return aIndex < this.selectedItems.length
      ? this.selectedItems[aIndex]
      : null;
  }
  timedSelect(aItem, aTimeout) {
    var suppress = this._suppressOnSelect;
    if (aTimeout != -1) this._suppressOnSelect = true;

    this.selectItem(aItem);

    this._suppressOnSelect = suppress;

    if (aTimeout != -1) {
      if (this._selectTimeout) window.clearTimeout(this._selectTimeout);
      this._selectTimeout = window.setTimeout(
        this._selectTimeoutHandler,
        aTimeout,
        this
      );
    }
  }
  moveByOffset(aOffset, aIsSelecting, aIsSelectingRange) {
    if ((aIsSelectingRange || !aIsSelecting) && this.selType != "multiple")
      return;

    var newIndex = this.currentIndex + aOffset;
    if (newIndex < 0) newIndex = 0;

    var numItems = this.getRowCount();
    if (newIndex > numItems - 1) newIndex = numItems - 1;

    var newItem = this.getItemAtIndex(newIndex);
    // make sure that the item is actually visible/selectable
    if (this._userSelecting && newItem && !this._canUserSelect(newItem))
      newItem = aOffset > 0
        ? this.getNextItem(newItem, 1) || this.getPreviousItem(newItem, 1)
        : this.getPreviousItem(newItem, 1) || this.getNextItem(newItem, 1);
    if (newItem) {
      this.ensureIndexIsVisible(this.getIndexOfItem(newItem));
      if (aIsSelectingRange) this.selectItemRange(null, newItem);
      else if (aIsSelecting) this.selectItem(newItem);

      this.currentItem = newItem;
    }
  }
  getNextItem(aStartItem, aDelta) {
    while (aStartItem) {
      aStartItem = aStartItem.nextSibling;
      if (
        aStartItem &&
        aStartItem instanceof
          Components.interfaces.nsIDOMXULSelectControlItemElement &&
        (!this._userSelecting || this._canUserSelect(aStartItem))
      ) {
        --aDelta;
        if (aDelta == 0) return aStartItem;
      }
    }
    return null;
  }
  getPreviousItem(aStartItem, aDelta) {
    while (aStartItem) {
      aStartItem = aStartItem.previousSibling;
      if (
        aStartItem &&
        aStartItem instanceof
          Components.interfaces.nsIDOMXULSelectControlItemElement &&
        (!this._userSelecting || this._canUserSelect(aStartItem))
      ) {
        --aDelta;
        if (aDelta == 0) return aStartItem;
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
  _selectTimeoutHandler(aMe) {}
}
customElements.define("xbl-listbox-base", XblListboxBase);
