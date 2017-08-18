class FirefoxListboxBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-listbox-base");
    this.prepend(comment);

    Object.defineProperty(this, "_lastKeyTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastKeyTime;
        return (this._lastKeyTime = 0);
      },
      set(val) {
        delete this["_lastKeyTime"];
        return (this["_lastKeyTime"] = val);
      }
    });
    Object.defineProperty(this, "_incrementalString", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._incrementalString;
        return (this._incrementalString = "");
      },
      set(val) {
        delete this["_incrementalString"];
        return (this["_incrementalString"] = val);
      }
    });
    Object.defineProperty(this, "selectedItems", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.selectedItems;
        return (this.selectedItems = new ChromeNodeList());
      },
      set(val) {
        delete this["selectedItems"];
        return (this["selectedItems"] = val);
      }
    });
    Object.defineProperty(this, "_suppressOnSelect", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._suppressOnSelect;
        return (this._suppressOnSelect = false);
      },
      set(val) {
        delete this["_suppressOnSelect"];
        return (this["_suppressOnSelect"] = val);
      }
    });
    Object.defineProperty(this, "_userSelecting", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._userSelecting;
        return (this._userSelecting = false);
      },
      set(val) {
        delete this["_userSelecting"];
        return (this["_userSelecting"] = val);
      }
    });
    Object.defineProperty(this, "_mayReverse", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._mayReverse;
        return (this._mayReverse = false);
      },
      set(val) {
        delete this["_mayReverse"];
        return (this["_mayReverse"] = val);
      }
    });
    Object.defineProperty(this, "_selectTimeout", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._selectTimeout;
        return (this._selectTimeout = null);
      },
      set(val) {
        delete this["_selectTimeout"];
        return (this["_selectTimeout"] = val);
      }
    });
    Object.defineProperty(this, "_currentItem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._currentItem;
        return (this._currentItem = null);
      },
      set(val) {
        delete this["_currentItem"];
        return (this["_currentItem"] = val);
      }
    });
    Object.defineProperty(this, "_selectionStart", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._selectionStart;
        return (this._selectionStart = null);
      },
      set(val) {
        delete this["_selectionStart"];
        return (this["_selectionStart"] = val);
      }
    });
  }
  disconnectedCallback() {}

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
    if (kids && kids.item(0)) this.selectItem(kids[0]);
    return val;
  }

  get value() {
    if (this.selectedItems.length > 0) return this.selectedItem.value;
    return null;
  }

  set selType(val) {
    this.setAttribute("seltype", val);
    return val;
  }

  get selType() {
    return this.getAttribute("seltype");
  }

  set currentItem(val) {
    undefined;
  }

  get currentItem() {
    return this._currentItem;
  }

  set currentIndex(val) {
    if (val >= 0) this.currentItem = this.getItemAtIndex(val);
    else this.currentItem = null;
  }

  get currentIndex() {
    undefined;
  }

  get selectedCount() {
    return this.selectedItems.length;
  }

  set disableKeyNavigation(val) {
    undefined;
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
customElements.define("firefox-listbox-base", FirefoxListboxBase);
