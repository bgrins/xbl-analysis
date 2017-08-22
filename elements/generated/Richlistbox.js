class FirefoxRichlistbox extends FirefoxListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="listheader">
</children>
<scrollbox allowevents="true" orient="vertical" anonid="main-box" flex="1" style="overflow: auto;" inherits="dir,pack">
<children>
</children>
</scrollbox>`;
    let comment = document.createComment("Creating firefox-richlistbox");
    this.prepend(comment);

    Object.defineProperty(this, "_scrollbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollbox;
        return (this._scrollbox = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "main-box"
        ));
      },
      set(val) {
        delete this._scrollbox;
        return (this._scrollbox = val);
      }
    });
    Object.defineProperty(this, "scrollBoxObject", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.scrollBoxObject;
        return (this.scrollBoxObject = this._scrollbox.boxObject);
      },
      set(val) {
        delete this.scrollBoxObject;
        return (this.scrollBoxObject = val);
      }
    });
    Object.defineProperty(this, "_builderListener", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._builderListener;
        return (this._builderListener = {
          mOuter: this,
          item: null,
          willRebuild(builder) {},
          didRebuild(builder) {
            this.mOuter._refreshSelection();
          }
        });
      },
      set(val) {
        delete this._builderListener;
        return (this._builderListener = val);
      }
    });
    Object.defineProperty(this, "_currentIndex", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._currentIndex;
        return (this._currentIndex = null);
      },
      set(val) {
        delete this._currentIndex;
        return (this._currentIndex = val);
      }
    });

    try {
      // add a template build listener
      if (this.builder) this.builder.addListener(this._builderListener);
      else this._refreshSelection();
    } catch (e) {}
  }
  disconnectedCallback() {
    try {
      // remove the template build listener
      if (this.builder) this.builder.removeListener(this._builderListener);
    } catch (e) {}
  }

  get itemCount() {
    return this.children.length;
  }

  get children() {
    let iface = Components.interfaces.nsIDOMXULSelectControlItemElement;
    let children = Array.from(this.childNodes).filter(
      node => node instanceof iface
    );
    if (this.dir == "reverse" && this._mayReverse) {
      children.reverse();
    }
    return children;
  }
  _fireOnSelect() {
    // make sure not to modify last-selected when suppressing select events
    // (otherwise we'll lose the selection when a template gets rebuilt)
    if (this._suppressOnSelect || this.suppressOnSelect) return;

    // remember the current item and all selected items with IDs
    var state = this.currentItem ? this.currentItem.id : "";
    if (this.selType == "multiple" && this.selectedCount) {
      let getId = function getId(aItem) {
        return aItem.id;
      };
      state += " " + [...this.selectedItems].filter(getId).map(getId).join(" ");
    }
    if (state) this.setAttribute("last-selected", state);
    else this.removeAttribute("last-selected");

    // preserve the index just in case no IDs are available
    if (this.currentIndex > -1) this._currentIndex = this.currentIndex + 1;

    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);

    // always call this (allows a commandupdater without controller)
    document.commandDispatcher.updateCommands("richlistbox-select");
  }
  getNextItem(aStartItem, aDelta) {
    var prop = this.dir == "reverse" && this._mayReverse
      ? "previousSibling"
      : "nextSibling";
    while (aStartItem) {
      aStartItem = aStartItem[prop];
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
    var prop = this.dir == "reverse" && this._mayReverse
      ? "nextSibling"
      : "previousSibling";
    while (aStartItem) {
      aStartItem = aStartItem[prop];
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
  appendItem(aLabel, aValue) {
    return this.insertItemAt(-1, aLabel, aValue);
  }
  insertItemAt(aIndex, aLabel, aValue) {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    var item = this.ownerDocument.createElementNS(XULNS, "richlistitem");
    item.setAttribute("value", aValue);

    var label = this.ownerDocument.createElementNS(XULNS, "label");
    label.setAttribute("value", aLabel);
    label.setAttribute("flex", "1");
    label.setAttribute("crop", "end");
    item.appendChild(label);

    var before = this.getItemAtIndex(aIndex);
    if (!before) this.appendChild(item);
    else this.insertBefore(item, before);

    return item;
  }
  getIndexOfItem(aItem) {
    // don't search the children, if we're looking for none of them
    if (aItem == null) return -1;
    if (this._selecting && this._selecting.item == aItem)
      return this._selecting.index;
    return this.children.indexOf(aItem);
  }
  getItemAtIndex(aIndex) {
    if (this._selecting && this._selecting.index == aIndex)
      return this._selecting.item;
    return this.children[aIndex] || null;
  }
  ensureIndexIsVisible(aIndex) {
    // work around missing implementation in scrollBoxObject
    return this.ensureElementIsVisible(this.getItemAtIndex(aIndex));
  }
  ensureElementIsVisible(aElement) {
    if (!aElement) return;
    var targetRect = aElement.getBoundingClientRect();
    var scrollRect = this._scrollbox.getBoundingClientRect();
    var offset = targetRect.top - scrollRect.top;
    if (offset >= 0) {
      // scrollRect.bottom wouldn't take a horizontal scroll bar into account
      let scrollRectBottom = scrollRect.top + this._scrollbox.clientHeight;
      offset = targetRect.bottom - scrollRectBottom;
      if (offset <= 0) return;
    }
    this._scrollbox.scrollTop += offset;
  }
  scrollToIndex(aIndex) {
    var item = this.getItemAtIndex(aIndex);
    if (item) this.scrollBoxObject.scrollToElement(item);
  }
  getNumberOfVisibleRows() {
    var children = this.children;

    for (
      var top = 0;
      top < children.length && !this._isItemVisible(children[top]);
      top++
    );
    for (
      var ix = top;
      ix < children.length && this._isItemVisible(children[ix]);
      ix++
    );

    return ix - top;
  }
  getIndexOfFirstVisibleRow() {
    var children = this.children;

    for (var ix = 0; ix < children.length; ix++)
      if (this._isItemVisible(children[ix])) return ix;

    return -1;
  }
  getRowCount() {
    return this.children.length;
  }
  scrollOnePage(aDirection) {
    var children = this.children;

    if (children.length == 0) return 0;

    // If nothing is selected, we just select the first element
    // at the extreme we're moving away from
    if (!this.currentItem) return aDirection == -1 ? children.length : 0;

    // If the current item is visible, scroll by one page so that
    // the new current item is at approximately the same position as
    // the existing current item.
    if (this._isItemVisible(this.currentItem))
      this.scrollBoxObject.scrollBy(
        0,
        this.scrollBoxObject.height * aDirection
      );

    // Figure out, how many items fully fit into the view port
    // (including the currently selected one), and determine
    // the index of the first one lying (partially) outside
    var height = this.scrollBoxObject.height;
    var startBorder = this.currentItem.boxObject.y;
    if (aDirection == -1) startBorder += this.currentItem.boxObject.height;

    var index = this.currentIndex;
    for (var ix = index; 0 <= ix && ix < children.length; ix += aDirection) {
      var boxObject = children[ix].boxObject;
      if (boxObject.height == 0) continue; // hidden children have a y of 0
      var endBorder = boxObject.y + (aDirection == -1 ? boxObject.height : 0);
      if ((endBorder - startBorder) * aDirection > height) break; // we've reached the desired distance
      index = ix;
    }

    return index != this.currentIndex ? index - this.currentIndex : aDirection;
  }
  _refreshSelection() {
    // when this method is called, we know that either the currentItem
    // and selectedItems we have are null (ctor) or a reference to an
    // element no longer in the DOM (template).

    // first look for the last-selected attribute
    var state = this.getAttribute("last-selected");
    if (state) {
      var ids = state.split(" ");

      var suppressSelect = this._suppressOnSelect;
      this._suppressOnSelect = true;
      this.clearSelection();
      for (let i = 1; i < ids.length; i++) {
        var selectedItem = document.getElementById(ids[i]);
        if (selectedItem) this.addItemToSelection(selectedItem);
      }

      var currentItem = document.getElementById(ids[0]);
      if (!currentItem && this._currentIndex)
        currentItem = this.getItemAtIndex(
          Math.min(this._currentIndex - 1, this.getRowCount())
        );
      if (currentItem) {
        this.currentItem = currentItem;
        if (this.selType != "multiple" && this.selectedCount == 0)
          this.selectedItem = currentItem;

        if (this.scrollBoxObject.height) {
          this.ensureElementIsVisible(currentItem);
        } else {
          // XXX hack around a bug in ensureElementIsVisible as it will
          // scroll beyond the last element, bug 493645.
          var previousElement = this.dir == "reverse"
            ? currentItem.nextSibling
            : currentItem.previousSibling;
          this.ensureElementIsVisible(previousElement);
        }
      }
      this._suppressOnSelect = suppressSelect;
      // XXX actually it's just a refresh, but at least
      // the Extensions manager expects this:
      this._fireOnSelect();
      return;
    }

    // try to restore the selected items according to their IDs
    // (applies after a template rebuild, if last-selected was not set)
    if (this.selectedItems) {
      let itemIds = [];
      for (let i = this.selectedCount - 1; i >= 0; i--) {
        let selectedItem = this.selectedItems[i];
        itemIds.push(selectedItem.id);
        this.selectedItems.remove(selectedItem);
      }
      for (let i = 0; i < itemIds.length; i++) {
        let selectedItem = document.getElementById(itemIds[i]);
        if (selectedItem) {
          this.selectedItems.append(selectedItem);
        }
      }
    }
    if (this.currentItem && this.currentItem.id)
      this.currentItem = document.getElementById(this.currentItem.id);
    else this.currentItem = null;

    // if we have no previously current item or if the above check fails to
    // find the previous nodes (which causes it to clear selection)
    if (!this.currentItem && this.selectedCount == 0) {
      this.currentIndex = this._currentIndex ? this._currentIndex - 1 : 0;

      // cf. listbox constructor:
      // select items according to their attributes
      var children = this.children;
      for (let i = 0; i < children.length; ++i) {
        if (children[i].getAttribute("selected") == "true")
          this.selectedItems.append(children[i]);
      }
    }

    if (this.selType != "multiple" && this.selectedCount == 0)
      this.selectedItem = this.currentItem;
  }
  _isItemVisible(aItem) {
    if (!aItem) return false;

    var y = this.scrollBoxObject.positionY + this.scrollBoxObject.y;

    // Partially visible items are also considered visible
    return (
      aItem.boxObject.y + aItem.boxObject.height > y &&
      aItem.boxObject.y < y + this.scrollBoxObject.height
    );
  }
  getIndexOf(aElement) {
    return this.getIndexOfItem(aElement);
  }
  ensureSelectedElementIsVisible() {
    return this.ensureElementIsVisible(this.selectedItem);
  }
  goUp() {
    var index = this.currentIndex;
    this.moveByOffset(-1, true, false);
    return index != this.currentIndex;
  }
  goDown() {
    var index = this.currentIndex;
    this.moveByOffset(1, true, false);
    return index != this.currentIndex;
  }
  fireActiveItemEvent() {}
}
customElements.define("firefox-richlistbox", FirefoxRichlistbox);
