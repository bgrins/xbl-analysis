class FirefoxTreebody extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "_lastSelectedRow", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastSelectedRow;
        return (this._lastSelectedRow = -1);
      },
      set(val) {
        delete this._lastSelectedRow;
        return (this._lastSelectedRow = val);
      }
    });

    if ("_ensureColumnOrder" in this.parentNode)
      this.parentNode._ensureColumnOrder();

    this.addEventListener("mousedown", event => {
      if (this.parentNode.disabled) return;
      if (
        ((!this._isAccelPressed(event) ||
          !this.parentNode.pageUpOrDownMovesSelection) &&
          !event.shiftKey &&
          !event.metaKey) ||
        this.parentNode.view.selection.single
      ) {
        var b = this.parentNode.treeBoxObject;
        var cell = b.getCellAt(event.clientX, event.clientY);
        var view = this.parentNode.view;

        // save off the last selected row
        this._lastSelectedRow = cell.row;

        if (cell.row == -1) return;

        if (cell.childElt == "twisty") return;

        if (cell.col && event.button == 0) {
          if (cell.col.cycler) {
            view.cycleCell(cell.row, cell.col);
            return;
          } else if (
            cell.col.type == Components.interfaces.nsITreeColumn.TYPE_CHECKBOX
          ) {
            if (
              this.parentNode.editable &&
              cell.col.editable &&
              view.isEditable(cell.row, cell.col)
            ) {
              var value = view.getCellValue(cell.row, cell.col);
              value = value == "true" ? "false" : "true";
              view.setCellValue(cell.row, cell.col, value);
              return;
            }
          }
        }

        var cellSelType = this.parentNode._cellSelType;
        if (
          cellSelType == "text" &&
          cell.childElt != "text" &&
          cell.childElt != "image"
        )
          return;

        if (cellSelType) {
          if (!cell.col.selectable || !view.isSelectable(cell.row, cell.col)) {
            return;
          }
        }

        if (!view.selection.isSelected(cell.row)) {
          view.selection.select(cell.row);
          b.ensureRowIsVisible(cell.row);
        }

        if (cellSelType) {
          view.selection.currentColumn = cell.col;
        }
      }
    });

    this.addEventListener("click", event => {
      if (this.parentNode.disabled) return;
      var b = this.parentNode.treeBoxObject;
      var cell = b.getCellAt(event.clientX, event.clientY);
      var view = this.parentNode.view;

      if (cell.row == -1) return;

      if (cell.childElt == "twisty") {
        if (
          view.selection.currentIndex >= 0 &&
          view.isContainerOpen(cell.row)
        ) {
          var parentIndex = view.getParentIndex(view.selection.currentIndex);
          while (parentIndex >= 0 && parentIndex != cell.row)
            parentIndex = view.getParentIndex(parentIndex);
          if (parentIndex == cell.row) {
            var parentSelectable = true;
            if (this.parentNode._cellSelType) {
              var currentColumn = view.selection.currentColumn;
              if (!view.isSelectable(parentIndex, currentColumn))
                parentSelectable = false;
            }
            if (parentSelectable) view.selection.select(parentIndex);
          }
        }
        this.parentNode.changeOpenState(cell.row);
        return;
      }

      if (!view.selection.single) {
        var augment = this._isAccelPressed(event);
        if (event.shiftKey) {
          view.selection.rangedSelect(-1, cell.row, augment);
          b.ensureRowIsVisible(cell.row);
          return;
        }
        if (augment) {
          view.selection.toggleSelect(cell.row);
          b.ensureRowIsVisible(cell.row);
          view.selection.currentIndex = cell.row;
          return;
        }
      }

      /* We want to deselect all the selected items except what was
          clicked, UNLESS it was a right-click.  We have to do this
          in click rather than mousedown so that you can drag a
          selected group of items */

      if (!cell.col) return;

      // if the last row has changed in between the time we
      // mousedown and the time we click, don't fire the select handler.
      // see bug #92366
      if (
        !cell.col.cycler &&
        this._lastSelectedRow == cell.row &&
        cell.col.type != Components.interfaces.nsITreeColumn.TYPE_CHECKBOX
      ) {
        var cellSelType = this.parentNode._cellSelType;
        if (
          cellSelType == "text" &&
          cell.childElt != "text" &&
          cell.childElt != "image"
        )
          return;

        if (cellSelType) {
          if (!cell.col.selectable || !view.isSelectable(cell.row, cell.col)) {
            return;
          }
        }

        view.selection.select(cell.row);
        b.ensureRowIsVisible(cell.row);

        if (cellSelType) {
          view.selection.currentColumn = cell.col;
        }
      }
    });

    this.addEventListener("click", event => {
      if (this.parentNode.disabled) return;
      var tbo = this.parentNode.treeBoxObject;
      var view = this.parentNode.view;
      var row = view.selection.currentIndex;

      if (row == -1) return;

      var cell = tbo.getCellAt(event.clientX, event.clientY);

      if (cell.childElt != "twisty") {
        view.selection.currentColumn = cell.col;
        this.parentNode.startEditing(row, cell.col);
      }

      if (this.parentNode._editingColumn || !view.isContainer(row)) return;

      // Cyclers and twisties respond to single clicks, not double clicks
      if (cell.col && !cell.col.cycler && cell.childElt != "twisty")
        this.parentNode.changeOpenState(row);
    });
  }
}
customElements.define("firefox-treebody", FirefoxTreebody);
