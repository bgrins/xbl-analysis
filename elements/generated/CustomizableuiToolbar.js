class FirefoxCustomizableuiToolbar extends XULElement {
  connectedCallback() {
    Object.defineProperty(this, "overflowedDuringConstruction", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.overflowedDuringConstruction;
        return (this.overflowedDuringConstruction = null);
      },
      set(val) {
        delete this.overflowedDuringConstruction;
        return (this.overflowedDuringConstruction = val);
      }
    });

    let scope = {};
    Cu.import("resource:///modules/CustomizableUI.jsm", scope);
    let CustomizableUI = scope.CustomizableUI;
    // Add an early overflow event listener that will mark if the
    // toolbar overflowed during construction.
    if (CustomizableUI.isAreaOverflowable(this.id)) {
      this.addEventListener("overflow", this);
      this.addEventListener("underflow", this);
    }

    // Searching for the toolbox palette in the toolbar binding because
    // toolbars are constructed first.
    let toolbox = this.toolbox;
    if (toolbox && !toolbox.palette) {
      for (let node of toolbox.children) {
        if (node.localName == "toolbarpalette") {
          // Hold on to the palette but remove it from the document.
          toolbox.palette = node;
          toolbox.removeChild(node);
          break;
        }
      }
    }

    // pass the current set of children for comparison with placements:
    let children = Array.from(this.childNodes)
      .filter(
        node => node.getAttribute("skipintoolbarset") != "true" && node.id
      )
      .map(node => node.id);
    CustomizableUI.registerToolbarNode(this, children);
  }

  set toolbarName(val) {
    this.setAttribute("toolbarname", val);
    return val;
  }

  get toolbarName() {
    return this.getAttribute("toolbarname");
  }

  get customizationTarget() {
    if (this._customizationTarget) return this._customizationTarget;

    let id = this.getAttribute("customizationtarget");
    if (id) this._customizationTarget = document.getElementById(id);

    if (this._customizationTarget)
      this._customizationTarget.insertItem = this.insertItem.bind(this);
    else this._customizationTarget = this;

    return this._customizationTarget;
  }

  get toolbox() {
    if (this._toolbox) return this._toolbox;

    let toolboxId = this.getAttribute("toolboxid");
    if (toolboxId) {
      let toolbox = document.getElementById(toolboxId);
      if (toolbox) {
        this._toolbox = toolbox;
      }
    }

    if (
      !this._toolbox &&
      this.parentNode &&
      this.parentNode.localName == "toolbox"
    ) {
      this._toolbox = this.parentNode;
    }

    return this._toolbox;
  }

  set currentSet(val) {
    // Get list of new and old ids:
    let newVal = (val || "").split(",").filter(x => x);
    let oldIds = CustomizableUI.getWidgetIdsInArea(this.id);

    // Get a list of items only in the new list
    let newIds = newVal.filter(id => oldIds.indexOf(id) == -1);
    CustomizableUI.beginBatchUpdate();
    try {
      for (let newId of newIds) {
        oldIds = CustomizableUI.getWidgetIdsInArea(this.id);
        let nextId = newId;
        let pos;
        do {
          // Get the next item
          nextId = newVal[newVal.indexOf(nextId) + 1];
          // Figure out where it is in the old list
          pos = oldIds.indexOf(nextId);
          // If it's not in the old list, repeat:
        } while (pos == -1 && nextId);
        if (pos == -1) {
          pos = null; // We didn't find anything, insert at the end
        }
        CustomizableUI.addWidgetToArea(newId, this.id, pos);
      }

      let currentIds = this.currentSet.split(",");
      let removedIds = currentIds.filter(
        id => newIds.indexOf(id) == -1 && newVal.indexOf(id) == -1
      );
      for (let removedId of removedIds) {
        CustomizableUI.removeWidgetFromArea(removedId);
      }
    } finally {
      CustomizableUI.endBatchUpdate();
    }
  }

  get currentSet() {
    let currentWidgets = new Set();
    for (let node of this.customizationTarget.children) {
      let realNode = node.localName == "toolbarpaletteitem"
        ? node.firstChild
        : node;
      if (realNode.getAttribute("skipintoolbarset") != "true") {
        currentWidgets.add(realNode.id);
      }
    }
    if (this.getAttribute("overflowing") == "true") {
      let overflowTarget = this.getAttribute("overflowtarget");
      let overflowList = this.ownerDocument.getElementById(overflowTarget);
      for (let node of overflowList.children) {
        let realNode = node.localName == "toolbarpaletteitem"
          ? node.firstChild
          : node;
        if (realNode.getAttribute("skipintoolbarset") != "true") {
          currentWidgets.add(realNode.id);
        }
      }
    }
    let orderedPlacements = CustomizableUI.getWidgetIdsInArea(this.id);
    return orderedPlacements.filter(w => currentWidgets.has(w)).join(",");
  }
  handleEvent(aEvent) {
    if (aEvent.type == "overflow" && aEvent.detail > 0) {
      if (this.overflowable && this.overflowable.initialized) {
        this.overflowable.onOverflow(aEvent);
      } else {
        this.overflowedDuringConstruction = aEvent;
      }
    } else if (aEvent.type == "underflow" && aEvent.detail > 0) {
      this.overflowedDuringConstruction = null;
    }
  }
  insertItem(aId, aBeforeElt, aWrapper) {
    if (aWrapper) {
      Cu.reportError(
        "Can't insert " +
          aId +
          ": using insertItem " +
          "no longer supports wrapper elements."
      );
      return null;
    }

    // Hack, the customizable UI code makes this be the last position
    let pos = null;
    if (aBeforeElt) {
      let beforeInfo = CustomizableUI.getPlacementOfWidget(aBeforeElt.id);
      if (beforeInfo.area != this.id) {
        Cu.reportError(
          "Can't insert " +
            aId +
            " before " +
            aBeforeElt.id +
            " which isn't in this area (" +
            this.id +
            ")."
        );
        return null;
      }
      pos = beforeInfo.position;
    }

    CustomizableUI.addWidgetToArea(aId, this.id, pos);
    return this.ownerDocument.getElementById(aId);
  }
}
customElements.define(
  "firefox-customizableui-toolbar",
  FirefoxCustomizableuiToolbar
);
