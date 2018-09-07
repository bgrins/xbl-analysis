/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTree extends MozTreeBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="treecols"></children>
      <stack class="tree-stack" flex="1">
        <treerows class="tree-rows" flex="1" inherits="hidevscroll">
          <children></children>
        </treerows>
        <textbox anonid="input" class="tree-input" left="0" top="0" hidden="true"></textbox>
      </stack>
      <hbox inherits="collapsed=hidehscroll">
        <scrollbar orient="horizontal" flex="1" increment="16" style="position:relative; z-index:2147483647;" oncontextmenu="event.stopPropagation(); event.preventDefault();" onclick="event.stopPropagation(); event.preventDefault();" ondblclick="event.stopPropagation();" oncommand="event.stopPropagation();"></scrollbar>
        <scrollcorner inherits="collapsed=hidevscroll" oncontextmenu="event.stopPropagation(); event.preventDefault();" onclick="event.stopPropagation(); event.preventDefault();" ondblclick="event.stopPropagation();" oncommand="event.stopPropagation();"></scrollcorner>
      </hbox>
    `));
    this.pageUpOrDownMovesSelection = !/Mac/.test(navigator.platform);

    this._inputField = null;

    this._editingRow = -1;

    this._editingColumn = null;

    this._columnsDirty = true;

    this._lastKeyTime = 0;

    this._incrementalString = "";

    this._touchY = -1;

    this._setupEventListeners();
  }

  get columns() {
    return this.treeBoxObject.columns;
  }

  set view(val) {
    return this.treeBoxObject.view = val;
  }

  get view() {
    return this.treeBoxObject.view
  }

  get body() {
    return this.treeBoxObject.treeBody;
  }

  set editable(val) {
    if (val) this.setAttribute('editable', 'true');
    else this.removeAttribute('editable');
    return val;
  }

  get editable() {
    return this.getAttribute('editable') == 'true';
  }
  /**
   * ///////////////// nsIDOMXULSelectControlElement /////////////////  ///////////////// nsIDOMXULMultiSelectControlElement /////////////////
   */
  set selType(val) {
    this.setAttribute('seltype', val);
    return val;
  }

  get selType() {
    return this.getAttribute('seltype')
  }

  set currentIndex(val) {
    if (this.view) return this.view.selection.currentIndex = val;
    return val;
  }

  get currentIndex() {
    return this.view ? this.view.selection.currentIndex : -1;
  }

  get treeBoxObject() {
    return this.boxObject;
  }

  get contentView() {
    return this.view;
  }

  get builderView() {
    return this.view; /*.QueryInterface(Components.interfaces.nsIXULTreeBuilder)*/
  }

  set keepCurrentInView(val) {
    if (val) this.setAttribute('keepcurrentinview', 'true');
    else this.removeAttribute('keepcurrentinview');
    return val;
  }

  get keepCurrentInView() {
    return (this.getAttribute('keepcurrentinview') == 'true');
  }

  set enableColumnDrag(val) {
    if (val) this.setAttribute('enableColumnDrag', 'true');
    else this.removeAttribute('enableColumnDrag');
    return val;
  }

  get enableColumnDrag() {
    return this.hasAttribute('enableColumnDrag');
  }

  get inputField() {
    if (!this._inputField)
      this._inputField = document.getAnonymousElementByAttribute(this, "anonid", "input");
    return this._inputField;
  }

  set disableKeyNavigation(val) {
    if (val) this.setAttribute('disableKeyNavigation', 'true');
    else this.removeAttribute('disableKeyNavigation');
    return val;
  }

  get disableKeyNavigation() {
    return this.hasAttribute('disableKeyNavigation');
  }

  get editingRow() {
    return this._editingRow;
  }

  get editingColumn() {
    return this._editingColumn;
  }

  set _selectDelay(val) {
    this.setAttribute('_selectDelay', val);
  }

  get _selectDelay() {
    return this.getAttribute('_selectDelay') || 50;
  }

  _ensureColumnOrder() {
    if (!this._columnsDirty)
      return;

    if (this.columns) {
      // update the ordinal position of each column to assure that it is
      // an odd number and 2 positions above its next sibling
      var cols = [];
      var i;
      for (var col = this.columns.getFirstColumn(); col; col = col.getNext())
        cols.push(col.element);
      for (i = 0; i < cols.length; ++i)
        cols[i].setAttribute("ordinal", (i * 2) + 1);

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
      if (aBefore)
        cols.push(aColBefore);
      for (col = col.getNext(); col.element != aColMove; col = col.getNext())
        cols.push(col.element);

      aColMove.ordinal = cols[0].ordinal;
      for (i = 0; i < cols.length; ++i)
        cols[i].ordinal = parseInt(cols[i].ordinal) + 2;
    } else if (aColBefore.ordinal != aColMove.ordinal) {
      if (!aBefore)
        cols.push(aColBefore);
      for (col = col.getPrevious(); col.element != aColMove; col = col.getPrevious())
        cols.push(col.element);

      aColMove.ordinal = cols[0].ordinal;
      for (i = 0; i < cols.length; ++i)
        cols[i].ordinal = parseInt(cols[i].ordinal) - 2;
    }
  }

  _getColumnAtX(aX, aThresh, aPos) {
    var isRTL = document.defaultView.getComputedStyle(this)
      .direction == "rtl";

    if (aPos)
      aPos.value = isRTL ? "after" : "before";

    var columns = [];
    var col = this.columns.getFirstColumn();
    while (col) {
      columns.push(col);
      col = col.getNext();
    }
    if (isRTL)
      columns.reverse();
    var currentX = this.boxObject.x;
    var adjustedX = aX + this.treeBoxObject.horizontalPosition;
    for (var i = 0; i < columns.length; ++i) {
      col = columns[i];
      var cw = col.element.boxObject.width;
      if (cw > 0) {
        currentX += cw;
        if (currentX - (cw * aThresh) > adjustedX)
          return col.element;
      }
    }

    if (aPos)
      aPos.value = isRTL ? "before" : "after";
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
    while (col && (col.width == 0 || !col.selectable ||
        !this.view.isSelectable(row, col)))
      col = left ? col.getPrevious() : col.getNext();
    return col;
  }

  _keyNavigate(event) {
    var key = String.fromCharCode(event.charCode).toLowerCase();
    if (event.timeStamp - this._lastKeyTime > 1000)
      this._incrementalString = key;
    else
      this._incrementalString += key;
    this._lastKeyTime = event.timeStamp;

    var length = this._incrementalString.length;
    var incrementalString = this._incrementalString;
    var charIndex = 1;
    while (charIndex < length && incrementalString[charIndex] == incrementalString[charIndex - 1])
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
      if (c < 0)
        c = 0;
    }

    for (var i = 0; i < rowCount; i++) {
      var l = (i + start + c) % rowCount;
      var cellText = this.view.getCellText(l, keyCol);
      cellText = cellText.substring(0, length).toLowerCase();
      if (cellText == incrementalString)
        return l;
    }
    return -1;
  }

  startEditing(row, column) {
    if (!this.editable)
      return false;
    if (row < 0 || row >= this.view.rowCount || !column)
      return false;
    if (column.type != window.TreeColumn.TYPE_TEXT &&
      column.type != window.TreeColumn.TYPE_PASSWORD)
      return false;
    if (column.cycler || !this.view.isEditable(row, column))
      return false;

    // Beyond this point, we are going to edit the cell.
    if (this._editingColumn)
      this.stopEditing();

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
    input.height = textRect.height + topadj +
      parseInt(style.borderBottomWidth) +
      parseInt(style.paddingBottom);
    input.width = cellRect.width - widthdiff;
    input.hidden = false;

    input.value = this.view.getCellText(row, column);

    input.select();
    input.inputField.focus();

    this._editingRow = row;
    this._editingColumn = column;
    this.setAttribute("editing", "true");

    box.invalidateCell(row, column);
    return true;
  }

  stopEditing(accept) {
    if (!this._editingColumn)
      return;

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

    if (this.view.rowCount == 0)
      return;

    if (this._isAccelPressed(event) && this.view.selection.single) {
      this.treeBoxObject.scrollByLines(offset);
      return;
    }

    var c = this.currentIndex + offset;
    if (offset > 0 ? c > edge : c < edge) {
      if (this.view.selection.isSelected(edge) && this.view.selection.count <= 1)
        return;
      c = edge;
    }

    if (!this._isAccelPressed(event))
      this.view.selection.timedSelect(c, this._selectDelay);
    else // Ctrl+Up/Down moves the anchor without selecting
      this.currentIndex = c;
    this.treeBoxObject.ensureRowIsVisible(c);
  }

  _moveByOffsetShift(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0)
      return;

    if (this.view.selection.single) {
      this.treeBoxObject.scrollByLines(offset);
      return;
    }

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    var c = this.currentIndex;
    if (c == -1)
      c = 0;

    if (c == edge) {
      if (this.view.selection.isSelected(c))
        return;
    }

    // Extend the selection from the existing pivot, if any
    this.view.selection.rangedSelect(-1, c + offset,
      this._isAccelPressed(event));
    this.treeBoxObject.ensureRowIsVisible(c + offset);

  }

  _moveByPage(offset, edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0)
      return;

    if (this.pageUpOrDownMovesSelection == this._isAccelPressed(event)) {
      this.treeBoxObject.scrollByPages(offset);
      return;
    }

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    var c = this.currentIndex;
    if (c == -1)
      return;

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

    if (this.view.rowCount == 0)
      return;

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0) &&
      !(this.pageUpOrDownMovesSelection == this._isAccelPressed(event))) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    if (this.view.selection.single)
      return;

    var c = this.currentIndex;
    if (c == -1)
      return;
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
      this.view.selection.rangedSelect(-1, i > edge ? edge : i, this._isAccelPressed(event));

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

    if (this.view.rowCount == 0)
      return;

    if (this.view.selection.isSelected(edge) && this.view.selection.count == 1) {
      this.currentIndex = edge;
      return;
    }

    // Normal behaviour is to select the first/last row
    if (!this._isAccelPressed(event))
      this.view.selection.timedSelect(edge, this._selectDelay);

    // In a multiselect tree Ctrl+Home/End moves the anchor
    else if (!this.view.selection.single)
      this.currentIndex = edge;

    this.treeBoxObject.ensureRowIsVisible(edge);
  }

  _moveToEdgeShift(edge, event) {
    event.preventDefault();

    if (this.view.rowCount == 0)
      return;

    if (this.view.rowCount == 1 && !this.view.selection.isSelected(0)) {
      this.view.selection.timedSelect(0, this._selectDelay);
      return;
    }

    if (this.view.selection.single ||
      (this.view.selection.isSelected(edge)) && this.view.selection.isSelected(this.currentIndex))
      return;

    // Extend the selection from the existing pivot, if any.
    // -1 doesn't work here, so using currentIndex instead
    this.view.selection.rangedSelect(this.currentIndex, edge, this._isAccelPressed(event));

    this.treeBoxObject.ensureRowIsVisible(edge);
  }

  _handleEnter(event) {
    if (this._editingColumn) {
      this.stopEditing(true);
      this.focus();
      return true;
    }

    return this.changeOpenState(this.currentIndex);
  }

  _setupEventListeners() {
    this.addEventListener("touchstart", (event) => {
      function isScrollbarElement(target) {
        return (target.localName == "thumb" || target.localName == "slider") &&
          target.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      }
      if (event.touches.length > 1 || isScrollbarElement(event.touches[0].target)) {
        // Multiple touch points detected, abort. In particular this aborts
        // the panning gesture when the user puts a second finger down after
        // already panning with one finger. Aborting at this point prevents
        // the pan gesture from being resumed until all fingers are lifted
        // (as opposed to when the user is back down to one finger).
        // Additionally, if the user lands on the scrollbar don't use this
        // code for scrolling, instead allow gecko to handle scrollbar
        // interaction normally.
        this._touchY = -1;
      } else {
        this._touchY = event.touches[0].screenY;
      }
    });

    this.addEventListener("touchmove", (event) => {
      if (event.touches.length == 1 &&
        this._touchY >= 0) {
        var deltaY = this._touchY - event.touches[0].screenY;
        var lines = Math.trunc(deltaY / this.treeBoxObject.rowHeight);
        if (Math.abs(lines) > 0) {
          this.treeBoxObject.scrollByLines(lines);
          deltaY -= lines * this.treeBoxObject.rowHeight;
          this._touchY = event.touches[0].screenY + deltaY;
        }
        event.preventDefault();
      }
    });

    this.addEventListener("touchend", (event) => {
      this._touchY = -1;
    });

    this.addEventListener("MozMousePixelScroll", (event) => {
      if (!(this.getAttribute("allowunderflowscroll") == "true" &&
          this.getAttribute("hidevscroll") == "true"))
        event.preventDefault();
    });

    this.addEventListener("DOMMouseScroll", (event) => {
      if (!(this.getAttribute("allowunderflowscroll") == "true" &&
          this.getAttribute("hidevscroll") == "true"))
        event.preventDefault();

      if (this._editingColumn)
        return;
      if (event.axis == event.HORIZONTAL_AXIS)
        return;

      var rows = event.detail;
      if (rows == UIEvent.SCROLL_PAGE_UP)
        this.treeBoxObject.scrollByPages(-1);
      else if (rows == UIEvent.SCROLL_PAGE_DOWN)
        this.treeBoxObject.scrollByPages(1);
      else
        this.treeBoxObject.scrollByLines(rows);
    });

    this.addEventListener("MozSwipeGesture", (event) => {
      // Figure out which row to show
      let targetRow = 0;

      // Only handle swipe gestures up and down
      switch (event.direction) {
        case event.DIRECTION_DOWN:
          targetRow = this.view.rowCount - 1;
          // Fall through for actual action
        case event.DIRECTION_UP:
          this.treeBoxObject.ensureRowIsVisible(targetRow);
          break;
      }
    });

    this.addEventListener("select", (event) => { if (event.originalTarget == this) this.stopEditing(true); });

    this.addEventListener("focus", (event) => {
      this.treeBoxObject.focused = true;
      if (this.currentIndex == -1 && this.view.rowCount > 0) {
        this.currentIndex = this.treeBoxObject.getFirstVisibleRow();
      }
    });

    this.addEventListener("blur", (event) => { this.treeBoxObject.focused = false; });

    this.addEventListener("blur", (event) => { if (event.originalTarget == this.inputField.inputField) this.stopEditing(true); }, true);

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RETURN) { return; }
      if (this._handleEnter(event)) {
        event.stopPropagation();
        event.preventDefault();
      }
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_ESCAPE) { return; }
      if (this._editingColumn) {
        this.stopEditing(false);
        this.focus();
        event.stopPropagation();
        event.preventDefault();
      }
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; }
      if (this._editingColumn)
        return;

      var row = this.currentIndex;
      if (row < 0)
        return;

      var checkContainers = true;
      if (checkContainers) {
        if (this.changeOpenState(this.currentIndex, false)) {
          event.preventDefault();
          return;
        }
        var parentIndex = this.view.getParentIndex(this.currentIndex);
        if (parentIndex >= 0) {
          this.view.selection.select(parentIndex);
          this.treeBoxObject.ensureRowIsVisible(parentIndex);
          event.preventDefault();
        }
      }
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; }
      if (this._editingColumn)
        return;

      var row = this.currentIndex;
      if (row < 0)
        return;

      var checkContainers = true;
      if (checkContainers) {
        if (this.changeOpenState(row, true)) {
          event.preventDefault();
          return;
        }
        var c = row + 1;
        var view = this.view;
        if (c < view.rowCount &&
          view.getParentIndex(c) == row) {
          // If already opened, select the first child.
          // The getParentIndex test above ensures that the children
          // are already populated and ready.
          this.view.selection.timedSelect(c, this._selectDelay);
          this.treeBoxObject.ensureRowIsVisible(c);
          event.preventDefault();
        }
      }
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_UP) { return; }
      if (this._editingColumn)
        return;
      this._moveByOffset(-1, 0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_DOWN) { return; }
      if (this._editingColumn)
        return;
      this._moveByOffset(1, this.view.rowCount - 1, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_UP) { return; }
      if (this._editingColumn)
        return;
      this._moveByOffsetShift(-1, 0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_DOWN) { return; }
      if (this._editingColumn)
        return;
      this._moveByOffsetShift(1, this.view.rowCount - 1, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_PAGE_UP) { return; }
      if (this._editingColumn)
        return;
      this._moveByPage(-1, 0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_PAGE_DOWN) { return; }
      if (this._editingColumn)
        return;
      this._moveByPage(1, this.view.rowCount - 1, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_PAGE_UP) { return; }
      if (this._editingColumn)
        return;
      this._moveByPageShift(-1, 0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_PAGE_DOWN) { return; }
      if (this._editingColumn)
        return;
      this._moveByPageShift(1, this.view.rowCount - 1, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; }
      if (this._editingColumn)
        return;
      this._moveToEdge(0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_END) { return; }
      if (this._editingColumn)
        return;
      this._moveToEdge(this.view.rowCount - 1, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; }
      if (this._editingColumn)
        return;
      this._moveToEdgeShift(0, event);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_END) { return; }
      if (this._editingColumn)
        return;
      this._moveToEdgeShift(this.view.rowCount - 1, event);
    });

    this.addEventListener("keypress", (event) => {
      if (this._editingColumn)
        return;

      if (event.charCode == " ".charCodeAt(0)) {
        var c = this.currentIndex;
        if (!this.view.selection.isSelected(c) ||
          (!this.view.selection.single && this._isAccelPressed(event))) {
          this.view.selection.toggleSelect(c);
          event.preventDefault();
        }
      } else if (!this.disableKeyNavigation && event.charCode > 0 &&
        !event.altKey && !this._isAccelPressed(event) &&
        !event.metaKey && !event.ctrlKey) {
        var l = this._keyNavigate(event);
        if (l >= 0) {
          this.view.selection.timedSelect(l, this._selectDelay);
          this.treeBoxObject.ensureRowIsVisible(l);
        }
        event.preventDefault();
      }
    });

  }
}

customElements.define("tree", MozTree);

}
