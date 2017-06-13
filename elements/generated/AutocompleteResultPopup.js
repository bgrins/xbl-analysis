class XblAutocompleteResultPopup extends XblAutocompleteBasePopup {
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
      "Creating xbl-autocomplete-result-popup"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get showCommentColumn() {
    return this.mShowCommentColumn;
  }

  get showImageColumn() {
    return this.mShowImageColumn;
  }

  get selectedIndex() {
    return this.tree.currentIndex;
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
  "xbl-autocomplete-result-popup",
  XblAutocompleteResultPopup
);
