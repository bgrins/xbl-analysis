class FirefoxTree extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="treecols">
</children>
<stack class="tree-stack" flex="1">
<treerows class="tree-rows" flex="1" inherits="hidevscroll">
<children>
</children>
</treerows>
<textbox anonid="input" class="tree-input" left="0" top="0" hidden="true">
</textbox>
</stack>
<hbox inherits="collapsed=hidehscroll">
<scrollbar orient="horizontal" flex="1" increment="16" style="position:relative; z-index:2147483647;">
</scrollbar>
<scrollcorner inherits="collapsed=hidevscroll">
</scrollcorner>
</hbox>`;
    let comment = document.createComment("Creating firefox-tree");
    this.prepend(comment);

    Object.defineProperty(this, "pageUpOrDownMovesSelection", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.pageUpOrDownMovesSelection;
        return (this.pageUpOrDownMovesSelection = !/Mac/.test(
          navigator.platform
        ));
      },
      set(val) {
        delete this.pageUpOrDownMovesSelection;
        return (this.pageUpOrDownMovesSelection = val);
      }
    });
    Object.defineProperty(this, "_inputField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._inputField;
        return (this._inputField = null);
      },
      set(val) {
        delete this._inputField;
        return (this._inputField = val);
      }
    });
    Object.defineProperty(this, "_editingRow", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._editingRow;
        return (this._editingRow = -1);
      },
      set(val) {
        delete this._editingRow;
        return (this._editingRow = val);
      }
    });
    Object.defineProperty(this, "_editingColumn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._editingColumn;
        return (this._editingColumn = null);
      },
      set(val) {
        delete this._editingColumn;
        return (this._editingColumn = val);
      }
    });
    Object.defineProperty(this, "_columnsDirty", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._columnsDirty;
        return (this._columnsDirty = true);
      },
      set(val) {
        delete this._columnsDirty;
        return (this._columnsDirty = val);
      }
    });
    Object.defineProperty(this, "_lastKeyTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastKeyTime;
        return (this._lastKeyTime = 0);
      },
      set(val) {
        delete this._lastKeyTime;
        return (this._lastKeyTime = val);
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
        delete this._incrementalString;
        return (this._incrementalString = val);
      }
    });
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
  }
  disconnectedCallback() {}

  get columns() {
    return this.treeBoxObject.columns;
  }

  set view(val) {
    return (this.treeBoxObject.view = val);
  }

  get view() {
    return this.treeBoxObject.view
      ? this.treeBoxObject.view.QueryInterface(
          Components.interfaces.nsITreeView
        )
      : null;
  }

  get body() {
    return this.treeBoxObject.treeBody;
  }

  set editable(val) {
    if (val) this.setAttribute("editable", "true");
    else this.removeAttribute("editable");
    return val;
  }

  get editable() {
    return this.getAttribute("editable") == "true";
  }

  set selType(val) {
    this.setAttribute("seltype", val);
    return val;
  }

  get selType() {
    return this.getAttribute("seltype");
  }

  set currentIndex(val) {
    if (this.view) return (this.view.selection.currentIndex = val);
    return val;
  }

  get currentIndex() {
    return this.view ? this.view.selection.currentIndex : -1;
  }

  get treeBoxObject() {
    return this.boxObject;
  }

  get contentView() {
    return this
      .view; /*.QueryInterface(Components.interfaces.nsITreeContentView)*/
  }

  get builderView() {
    return this
      .view; /*.QueryInterface(Components.interfaces.nsIXULTreeBuilder)*/
  }

  set keepCurrentInView(val) {
    if (val) this.setAttribute("keepcurrentinview", "true");
    else this.removeAttribute("keepcurrentinview");
    return val;
  }

  get keepCurrentInView() {
    return this.getAttribute("keepcurrentinview") == "true";
  }

  set enableColumnDrag(val) {
    if (val) this.setAttribute("enableColumnDrag", "true");
    else this.removeAttribute("enableColumnDrag");
    return val;
  }

  get enableColumnDrag() {
    return this.hasAttribute("enableColumnDrag");
  }

  get inputField() {
    if (!this._inputField)
      this._inputField = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "input"
      );
    return this._inputField;
  }

  set disableKeyNavigation(val) {
    if (val) this.setAttribute("disableKeyNavigation", "true");
    else this.removeAttribute("disableKeyNavigation");
    return val;
  }

  get disableKeyNavigation() {
    return this.hasAttribute("disableKeyNavigation");
  }

  get editingRow() {
    return this._editingRow;
  }

  get editingColumn() {
    return this._editingColumn;
  }

  set _selectDelay(val) {
    this.setAttribute("_selectDelay", val);
  }

  get _selectDelay() {
    return this.getAttribute("_selectDelay") || 50;
  }

  get _cellSelType() {
    var seltype = this.selType;
    if (seltype == "cell" || seltype == "text") return seltype;
    return null;
  }
  _ensureColumnOrder() {
    if (!this._columnsDirty) return;

    if (this.columns) {
      // update the ordinal position of each column to assure that it is
      // an odd number and 2 positions above its next sibling
      var cols = [];
      var i;
      for (var col = this.columns.getFirstColumn(); col; col = col.getNext())
        cols.push(col.element);
      for (i = 0; i < cols.length; ++i)
        cols[i].setAttribute("ordinal", i * 2 + 1);

      // update the ordinal positions of splitters to even numbers, so that
      // they are in between columns
      var splitters = this.getElementsByTagName("splitter");
      for (i = 0; i < splitters.length; ++i)
        splitters[i].setAttribute("ordinal", (i + 1) * 2);
    }
    this._columnsDirty = false;
  }
  _reorderColumn(aColMove, aColBefore, aBefore) {
    this._ensureColumnOrder();

    var i;
    var cols = [];
    var col = this.columns.getColumnFor(aColBefore);
    if (parseInt(aColBefore.ordinal) < parseInt(aColMove.ordinal)) {
      if (aBefore) cols.push(aColBefore);
      for (col = col.getNext(); col.element != aColMove; col = col.getNext())
        cols.push(col.element);

      aColMove.ordinal = cols[0].ordinal;
      for (i = 0; i < cols.length; ++i)
        cols[i].ordinal = parseInt(cols[i].ordinal) + 2;
    } else if (aColBefore.ordinal != aColMove.ordinal) {
      if (!aBefore) cols.push(aColBefore);
      for (
        col = col.getPrevious();
        col.element != aColMove;
        col = col.getPrevious()
      )
        cols.push(col.element);

      aColMove.ordinal = cols[0].ordinal;
      for (i = 0; i < cols.length; ++i)
        cols[i].ordinal = parseInt(cols[i].ordinal) - 2;
    }
  }
  _getColumnAtX(aX, aThresh, aPos) {
    var isRTL = document.defaultView.getComputedStyle(this).direction == "rtl";

    if (aPos) aPos.value = isRTL ? "after" : "before";

    var columns = [];
    var col = this.columns.getFirstColumn();
    while (col) {
      columns.push(col);
      col = col.getNext();
    }
    if (isRTL) columns.reverse();
    var currentX = this.boxObject.x;
    var adjustedX = aX + this.treeBoxObject.horizontalPosition;
    for (var i = 0; i < columns.length; ++i) {
      col = columns[i];
      var cw = col.element.boxObject.width;
      if (cw > 0) {
        currentX += cw;
        if (currentX - cw * aThresh > adjustedX) return col.element;
      }
    }

    if (aPos) aPos.value = isRTL ? "before" : "after";
    return columns.pop().element;
  }
  changeOpenState(row, openState) {
    if (row < 0 || !this.view.isContainer(row)) {
      return false;
    }

    if (this.view.isContainerOpen(row) != openState) {
      this.view.toggleOpenState(row);
      if (row == this.currentIndex) {
        // Only fire event when current row is expanded or collapsed
        // because that's all the assistive technology really cares about.
        var event = document.createEvent("Events");
        event.initEvent("OpenStateChange", true, true);
        this.dispatchEvent(event);
      }
      return true;
    }
    return false;
  }
  _getNextColumn(row, left) {
    var col = this.view.selection.currentColumn;
    if (col) {
      col = left ? col.getPrevious() : col.getNext();
    } else {
      col = this.columns.getKeyColumn();
    }
    while (
      col &&
      (col.width == 0 || !col.selectable || !this.view.isSelectable(row, col))
    )
      col = left ? col.getPrevious() : col.getNext();
    return col;
  }
  _keyNavigate(event) {
    var key = String.fromCharCode(event.charCode).toLowerCase();
    if (event.timeStamp - this._lastKeyTime > 1000)
      this._incrementalString = key;
    else this._incrementalString += key;
    this._lastKeyTime = event.timeStamp;

    var length = this._incrementalString.length;
    var incrementalString = this._incrementalString;
    var charIndex = 1;
    while (
      charIndex < length &&
      incrementalString[charIndex] == incrementalString[charIndex - 1]
    )
      charIndex++;
    // If all letters in incremental string are same, just try to match the first one
    if (charIndex == length) {
      length = 1;
      incrementalString = incrementalString.substring(0, length);
    }

    var keyCol = this.columns.getKeyColumn();
    var rowCount = this.view.rowCount;
    var start = 1;

    var c = this.currentIndex;
    if (length > 1) {
      start = 0;
      if (c < 0) c = 0;
    }

    for (var i = 0; i < rowCount; i++) {
      var l = (i + start + c) % rowCount;
      var cellText = this.view.getCellText(l, keyCol);
      cellText = cellText.substring(0, length).toLowerCase();
      if (cellText == incrementalString) return l;
    }
    return -1;
  }
  startEditing(row, column) {
    if (!this.editable) return false;
    if (row < 0 || row >= this.view.rowCount || !column) return false;
    if (
      column.type != Components.interfaces.nsITreeColumn.TYPE_TEXT &&
      column.type != Components.interfaces.nsITreeColumn.TYPE_PASSWORD
    )
      return false;
    if (column.cycler || !this.view.isEditable(row, column)) return false;

    // Beyond this point, we are going to edit the cell.
    if (this._editingColumn) this.stopEditing();

    var input = this.inputField;

    var box = this.treeBoxObject;
    box.ensureCellIsVisible(row, column);

    // Get the coordinates of the text inside the cell.
    var textRect = box.getCoordsForCellItem(row, column, "text");

    // Get the coordinates of the cell itself.
    var cellRect = box.getCoordsForCellItem(row, column, "cell");

    // Calculate the top offset of the textbox.
    var style = window.getComputedStyle(input);
    var topadj = parseInt(style.borderTopWidth) + parseInt(style.paddingTop);
    input.top = textRect.y - topadj;

    // The leftside of the textbox is aligned to the left side of the text
    // in LTR mode, and left side of the cell in RTL mode.
    var left, widthdiff;
    if (style.direction == "rtl") {
      left = cellRect.x;
      widthdiff = cellRect.x - textRect.x;
    } else {
      left = textRect.x;
      widthdiff = textRect.x - cellRect.x;
    }

    input.left = left;
    input.height =
      textRect.height +
      topadj +
      parseInt(style.borderBottomWidth) +
      parseInt(style.paddingBottom);
    input.width = cellRect.width - widthdiff;
    input.hidden = false;

    input.value = this.view.getCellText(row, column);
    var selectText = function selectText() {
      input.select();
      input.inputField.focus();
    };
    setTimeout(selectText, 0);

    this._editingRow = row;
    this._editingColumn = column;
    this.setAttribute("editing", "true");

    box.invalidateCell(row, column);
    return true;
  }
  stopEditing(accept) {
    if (!this._editingColumn) return;

    var input = this.inputField;
    var editingRow = this._editingRow;
    var editingColumn = this._editingColumn;
    this._editingRow = -1;
    this._editingColumn = null;

    if (accept) {
      var value = input.value;
      this.view.setCellText(editingRow, editingColumn, value);
    }
    input.hidden = true;
    input.value = "";
    this.removeAttribute("editing");
  }
  _moveByOffset(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (this._isAccelPressed(event) && this.view.selection.single) {
      this.treeBoxObject.scrollByLines(offset);
      return;
    }

    var c = this.currentIndex + offset;
    if (offset > 0 ? c > edge : c < edge) {
      if (
        this.view.selection.isSelected(edge) &&
        this.view.selection.count <= 1
      )
        return;
      c = edge;
    }

    var cellSelType = this._cellSelType;
    if (cellSelType) {
      var column = this.view.selection.currentColumn;
      if (!column) return;

      while (
        (offset > 0 ? c <= edge : c >= edge) &&
        !this.view.isSelectable(c, column)
      )
        c += offset;
      if (offset > 0 ? c > edge : c < edge) return;
    }

    if (!this._isAccelPressed(event))
      this.view.selection.timedSelect(c, this._selectDelay); // Ctrl+Up/Down moves the anchor without selecting
    else this.currentIndex = c;
    this.treeBoxObject.ensureRowIsVisible(c);
  }
  _moveByOffsetShift(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (this.view.selection.single) {
      this.treeBoxObject.scrollByLines(offset);
      return;
    }

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    var c = this.currentIndex;
    if (c == -1) c = 0;

    if (c == edge) {
      if (this.view.selection.isSelected(c)) return;
    }

    // Extend the selection from the existing pivot, if any
    this.view.selection.rangedSelect(
      -1,
      c + offset,
      this._isAccelPressed(event)
    );
    this.treeBoxObject.ensureRowIsVisible(c + offset);
  }
  _moveByPage(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (this.pageUpOrDownMovesSelection == this._isAccelPressed(event)) {
      this.treeBoxObject.scrollByPages(offset);
      return;
    }

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    var c = this.currentIndex;
    if (c == -1) return;

    if (c == edge && this.view.selection.isSelected(c)) {
      this.treeBoxObject.ensureRowIsVisible(c);
      return;
    }
    var i = this.treeBoxObject.getFirstVisibleRow();
    var p = this.treeBoxObject.getPageLength();

    if (offset > 0) {
      i += p - 1;
      if (c >= i) {
        i = c + p;
        this.treeBoxObject.ensureRowIsVisible(i > edge ? edge : i);
      }
      i = i > edge ? edge : i;
    } else if (c <= i) {
      i = c <= p ? 0 : c - p;
      this.treeBoxObject.ensureRowIsVisible(i);
    }
    this.view.selection.timedSelect(i, this._selectDelay);
  }
  _moveByPageShift(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (
      this.view.rowCount == 1 &&
      !this.view.selection.isSelected(0) &&
      !(this.pageUpOrDownMovesSelection == this._isAccelPressed(event))
    ) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    if (this.view.selection.single) return;

    var c = this.currentIndex;
    if (c == -1) return;
    if (c == edge && this.view.selection.isSelected(c)) {
      this.treeBoxObject.ensureRowIsVisible(edge);
      return;
    }
    var i = this.treeBoxObject.getFirstVisibleRow();
    var p = this.treeBoxObject.getPageLength();

    if (offset > 0) {
      i += p - 1;
      if (c >= i) {
        i = c + p;
        this.treeBoxObject.ensureRowIsVisible(i > edge ? edge : i);
      }
      // Extend the selection from the existing pivot, if any
      this.view.selection.rangedSelect(
        -1,
        i > edge ? edge : i,
        this._isAccelPressed(event)
      );
    } else {
      if (c <= i) {
        i = c <= p ? 0 : c - p;
        this.treeBoxObject.ensureRowIsVisible(i);
      }
      // Extend the selection from the existing pivot, if any
      this.view.selection.rangedSelect(-1, i, this._isAccelPressed(event));
    }
  }
  _moveToEdge(edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (
      this.view.selection.isSelected(edge) &&
      this.view.selection.count == 1
    ) {
      this.currentIndex = edge;
      return;
    }

    // Normal behaviour is to select the first/last row
    if (!this._isAccelPressed(event))
      this.view.selection.timedSelect(edge, this._selectDelay);
    else if (!this.view.selection.single)
      // In a multiselect tree Ctrl+Home/End moves the anchor
      this.currentIndex = edge;

    this.treeBoxObject.ensureRowIsVisible(edge);
  }
  _moveToEdgeShift(edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0) return;

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    if (
      this.view.selection.single ||
      (this.view.selection.isSelected(edge) &&
        this.view.selection.isSelected(this.currentIndex))
    )
      return;

    // Extend the selection from the existing pivot, if any.
    // -1 doesn't work here, so using currentIndex instead
    this.view.selection.rangedSelect(
      this.currentIndex,
      edge,
      this._isAccelPressed(event)
    );

    this.treeBoxObject.ensureRowIsVisible(edge);
  }
  _handleEnter(event) {
    if (this._editingColumn) {
      this.stopEditing(true);
      this.focus();
      return true;
    }

    if (/Mac/.test(navigator.platform)) {
      // See if we can edit the cell.
      var row = this.currentIndex;
      if (this._cellSelType) {
        var column = this.view.selection.currentColumn;
        var startedEditing = this.startEditing(row, column);
        if (startedEditing) return true;
      }
    }
    return this.changeOpenState(this.currentIndex);
  }
}
customElements.define("firefox-tree", FirefoxTree);
