class FirefoxAutocompleteResultPopup extends FirefoxAutocompleteBasePopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<tree anonid="tree" class="autocomplete-tree plain" hidecolumnpicker="true" flex="1" seltype="single">
<treecols anonid="treecols">
<treecol id="treecolAutoCompleteValue" class="autocomplete-treecol" flex="1" overflow="true">
</treecol>
</treecols>
<treechildren class="autocomplete-treebody">
</treechildren>
</tree>`;
    let comment = document.createComment(
      "Creating firefox-autocomplete-result-popup"
    );
    this.prepend(comment);

    Object.defineProperty(this, "mShowCommentColumn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mShowCommentColumn;
        return (this.mShowCommentColumn = false);
      },
      set(val) {
        delete this["mShowCommentColumn"];
        return (this["mShowCommentColumn"] = val);
      }
    });
    Object.defineProperty(this, "mShowImageColumn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mShowImageColumn;
        return (this.mShowImageColumn = false);
      },
      set(val) {
        delete this["mShowImageColumn"];
        return (this["mShowImageColumn"] = val);
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
        delete this["tree"];
        return (this["tree"] = val);
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
        delete this["treecols"];
        return (this["treecols"] = val);
      }
    });
  }
  disconnectedCallback() {}

  set showCommentColumn(val) {
    if (!val && this.mShowCommentColumn) {
      // reset the flex on the value column and remove the comment column
      document
        .getElementById("treecolAutoCompleteValue")
        .setAttribute("flex", 1);
      this.removeColumn("treecolAutoCompleteComment");
    } else if (val && !this.mShowCommentColumn) {
      // reset the flex on the value column and add the comment column
      document
        .getElementById("treecolAutoCompleteValue")
        .setAttribute("flex", 2);
      this.addColumn({ id: "treecolAutoCompleteComment", flex: 1 });
    }
    this.mShowCommentColumn = val;
    return val;
  }

  get showCommentColumn() {
    return this.mShowCommentColumn;
  }

  set showImageColumn(val) {
    if (!val && this.mShowImageColumn) {
      // remove the image column
      this.removeColumn("treecolAutoCompleteImage");
    } else if (val && !this.mShowImageColumn) {
      // add the image column
      this.addColumn({ id: "treecolAutoCompleteImage", flex: 1 });
    }
    this.mShowImageColumn = val;
    return val;
  }

  get showImageColumn() {
    return this.mShowImageColumn;
  }

  set selectedIndex(val) {
    this.tree.view.selection.select(val);
    if (this.tree.treeBoxObject.height > 0)
      this.tree.treeBoxObject.ensureRowIsVisible(val < 0 ? 0 : val);
    // Fire select event on xul:tree so that accessibility API
    // support layer can fire appropriate accessibility events.
    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.tree.dispatchEvent(event);
    return val;
  }

  get selectedIndex() {
    return this.tree.currentIndex;
  }

  set view(val) {
    // We must do this by hand because the tree binding may not be ready yet
    this.mView = val;
    this.tree.boxObject.view = val;
  }

  get view() {
    return this.mView;
  }
  addColumn(aAttrs) {
    var col = document.createElement("treecol");
    col.setAttribute("class", "autocomplete-treecol");
    for (var name in aAttrs) col.setAttribute(name, aAttrs[name]);
    this.treecols.appendChild(col);
    return col;
  }
  removeColumn(aColId) {
    return this.treecols.removeChild(document.getElementById(aColId));
  }
  adjustHeight() {
    // detect the desired height of the tree
    var bx = this.tree.treeBoxObject;
    var view = this.tree.view;
    if (!view) return;
    var rows = this.maxRows;
    if (!view.rowCount || (rows && view.rowCount < rows)) rows = view.rowCount;

    var height = rows * bx.rowHeight;

    if (height == 0) {
      this.tree.setAttribute("collapsed", "true");
    } else {
      if (this.tree.hasAttribute("collapsed"))
        this.tree.removeAttribute("collapsed");

      this.tree.setAttribute("height", height);
    }
    this.tree.setAttribute("hidescrollbar", view.rowCount <= rows);
  }
  openAutocompletePopup(aInput, aElement) {
    // until we have "baseBinding", (see bug #373652) this allows
    // us to override openAutocompletePopup(), but still call
    // the method on the base class
    this._openAutocompletePopup(aInput, aElement);
  }
  _openAutocompletePopup(aInput, aElement) {
    if (!this.mPopupOpen) {
      this.mInput = aInput;
      this.view = aInput.controller.QueryInterface(
        Components.interfaces.nsITreeView
      );
      this.invalidate();

      this.showCommentColumn = this.mInput.showCommentColumn;
      this.showImageColumn = this.mInput.showImageColumn;

      var rect = aElement.getBoundingClientRect();
      var nav = aElement.ownerGlobal
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation);
      var docShell = nav.QueryInterface(Components.interfaces.nsIDocShell);
      var docViewer = docShell.contentViewer;
      var width = (rect.right - rect.left) * docViewer.fullZoom;
      this.setAttribute("width", width > 100 ? width : 100);

      // Adjust the direction of the autocomplete popup list based on the textbox direction, bug 649840
      var popupDirection = aElement.ownerGlobal.getComputedStyle(aElement)
        .direction;
      this.style.direction = popupDirection;

      this.openPopup(aElement, "after_start", 0, 0, false, false);
    }
  }
  invalidate() {
    this.adjustHeight();
    this.tree.treeBoxObject.invalidate();
  }
  selectBy(aReverse, aPage) {
    try {
      var amount = aPage ? 5 : 1;
      this.selectedIndex = this.getNextIndex(
        aReverse,
        amount,
        this.selectedIndex,
        this.tree.view.rowCount - 1
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
  "firefox-autocomplete-result-popup",
  FirefoxAutocompleteResultPopup
);
