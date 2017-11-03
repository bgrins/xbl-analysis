class FirefoxAutocompleteResultPopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:tree anonid="tree" class="autocomplete-tree plain" flex="1">
        <xul:treecols anonid="treecols">
          <xul:treecol class="autocomplete-treecol" id="treecolAutoCompleteValue" flex="2"></xul:treecol>
          <xul:treecol class="autocomplete-treecol" id="treecolAutoCompleteComment" flex="1" hidden="true"></xul:treecol>
        </xul:treecols>
        <xul:treechildren anonid="treebody" class="autocomplete-treebody"></xul:treechildren>
      </xul:tree>
    `;
    Object.defineProperty(this, "textbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.textbox;
        return (this.textbox = document.getBindingParent(this));
      },
      set(val) {
        delete this.textbox;
        return (this.textbox = val);
      }
    });
    Object.defineProperty(this, "tree", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.tree;
        return (this.tree = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "tree"
        ));
      },
      set(val) {
        delete this.tree;
        return (this.tree = val);
      }
    });
    Object.defineProperty(this, "treecols", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.treecols;
        return (this.treecols = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "treecols"
        ));
      },
      set(val) {
        delete this.treecols;
        return (this.treecols = val);
      }
    });
    Object.defineProperty(this, "treebody", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.treebody;
        return (this.treebody = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "treebody"
        ));
      },
      set(val) {
        delete this.treebody;
        return (this.treebody = val);
      }
    });
    Object.defineProperty(this, "view", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.view;
        return (this.view = null);
      },
      set(val) {
        delete this.view;
        return (this.view = val);
      }
    });
    Object.defineProperty(this, "maxRows", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.maxRows;
        return (this.maxRows = 0);
      },
      set(val) {
        delete this.maxRows;
        return (this.maxRows = val);
      }
    });
    Object.defineProperty(this, "mLastRows", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastRows;
        return (this.mLastRows = 0);
      },
      set(val) {
        delete this.mLastRows;
        return (this.mLastRows = val);
      }
    });
    Object.defineProperty(this, "input", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.input;
        return (this.input = null);
      },
      set(val) {
        delete this.input;
        return (this.input = val);
      }
    });

    if (this.textbox && this.textbox.view) this.initialize();

    this.addEventListener("popupshowing", event => {
      if (this.textbox) this.textbox.mMenuOpen = true;
    });

    this.addEventListener("popuphiding", event => {
      if (this.textbox) this.textbox.mMenuOpen = false;
      this.clearSelection();
      this.input = null;
    });
  }
  disconnectedCallback() {
    if (this.view) this.tree.view = null;
  }

  get selection() {
    return this.tree.view.selection;
  }

  get pageCount() {
    return this.tree.treeBoxObject.getPageLength();
  }

  set showCommentColumn(val) {
    this.treecols.lastChild.hidden = !val;
    return val;
  }

  get showCommentColumn() {
    return !this.treecols.lastChild.hidden;
  }

  get overrideValue() {
    return null;
  }

  set selectedIndex(val) {
    if (this.view) {
      this.selection.select(val);
      if (val >= 0) {
        this.view.selection.currentIndex = -1;
        this.tree.treeBoxObject.ensureRowIsVisible(val);
      }
    }
    return val;
  }

  get selectedIndex() {
    if (!this.view || !this.selection.count) return -1;
    var start = {},
      end = {};
    this.view.selection.getRangeAt(0, start, end);
    return start.value;
  }

  get popupOpen() {
    return !!this.input;
  }
  initialize() {
    this.showCommentColumn = this.textbox.showCommentColumn;
    this.tree.view = this.textbox.view;
    this.view = this.textbox.view;
    this.maxRows = this.textbox.maxRows;
  }
  adjustHeight() {
    // detect the desired height of the tree
    var bx = this.tree.treeBoxObject;
    var view = this.view;
    var rows = this.maxRows || 6;
    if (!view.rowCount || (rows && view.rowCount < rows)) rows = view.rowCount;

    var height = rows * bx.rowHeight;

    if (height == 0) this.tree.setAttribute("collapsed", "true");
    else {
      if (this.tree.hasAttribute("collapsed"))
        this.tree.removeAttribute("collapsed");
      this.tree.setAttribute("height", height);
    }
  }
  clearSelection() {
    this.selection.clearSelection();
  }
  getNextIndex(aReverse, aPage, aIndex, aMaxRow) {
    if (aMaxRow < 0) return -1;

    if (aIndex == -1) return aReverse ? aMaxRow : 0;
    if (aIndex == (aReverse ? 0 : aMaxRow)) return -1;

    var amount = aPage ? this.pageCount - 1 : 1;
    aIndex = aReverse ? aIndex - amount : aIndex + amount;
    if (aIndex > aMaxRow) return aMaxRow;
    if (aIndex < 0) return 0;
    return aIndex;
  }
  openAutocompletePopup(aInput, aElement) {
    if (!this.input) {
      this.tree.view = aInput.controller;
      this.view = this.tree.view;
      this.showCommentColumn = aInput.showCommentColumn;
      this.maxRows = aInput.maxRows;
      this.invalidate();

      var viewer = aElement.ownerGlobal
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShell).contentViewer;
      var rect = aElement.getBoundingClientRect();
      var width = Math.round((rect.right - rect.left) * viewer.fullZoom);
      this.setAttribute("width", width > 100 ? width : 100);
      // Adjust the direction (which is not inherited) of the autocomplete
      // popup list, based on the textbox direction. (Bug 707039)
      this.style.direction = aElement.ownerGlobal.getComputedStyle(
        aElement
      ).direction;
      this.popupBoxObject.setConsumeRollupEvent(
        aInput.consumeRollupEvent
          ? PopupBoxObject.ROLLUP_CONSUME
          : PopupBoxObject.ROLLUP_NO_CONSUME
      );
      this.openPopup(aElement, "after_start", 0, 0, false, false);
      if (this.state != "closed") this.input = aInput;
    }
  }
  closePopup() {
    this.hidePopup();
  }
  invalidate() {
    if (this.view) this.adjustHeight();
    this.tree.treeBoxObject.invalidate();
  }
  selectBy(aReverse, aPage) {
    try {
      return (this.selectedIndex = this.getNextIndex(
        aReverse,
        aPage,
        this.selectedIndex,
        this.view.rowCount - 1
      ));
    } catch (ex) {
      // do nothing - occasionally timer-related js errors happen here
      // e.g. "this.selectedIndex has no properties", when you type fast and hit a
      // navigation key before this popup has opened
      return -1;
    }
  }
}
customElements.define(
  "firefox-autocomplete-result-popup",
  FirefoxAutocompleteResultPopup
);
