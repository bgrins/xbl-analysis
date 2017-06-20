class XblColorpicker extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox flex="1">
<hbox>
<image class="colorpickertile cp-light" color="#FFFFFF">
</image>
<image class="colorpickertile cp-light" color="#FFCCCC">
</image>
<image class="colorpickertile cp-light" color="#FFCC99">
</image>
<image class="colorpickertile cp-light" color="#FFFF99">
</image>
<image class="colorpickertile cp-light" color="#FFFFCC">
</image>
<image class="colorpickertile cp-light" color="#99FF99">
</image>
<image class="colorpickertile cp-light" color="#99FFFF">
</image>
<image class="colorpickertile cp-light" color="#CCFFFF">
</image>
<image class="colorpickertile cp-light" color="#CCCCFF">
</image>
<image class="colorpickertile cp-light" color="#FFCCFF">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#CCCCCC">
</image>
<image class="colorpickertile" color="#FF6666">
</image>
<image class="colorpickertile" color="#FF9966">
</image>
<image class="colorpickertile cp-light" color="#FFFF66">
</image>
<image class="colorpickertile cp-light" color="#FFFF33">
</image>
<image class="colorpickertile cp-light" color="#66FF99">
</image>
<image class="colorpickertile cp-light" color="#33FFFF">
</image>
<image class="colorpickertile cp-light" color="#66FFFF">
</image>
<image class="colorpickertile" color="#9999FF">
</image>
<image class="colorpickertile" color="#FF99FF">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#C0C0C0">
</image>
<image class="colorpickertile" color="#FF0000">
</image>
<image class="colorpickertile" color="#FF9900">
</image>
<image class="colorpickertile" color="#FFCC66">
</image>
<image class="colorpickertile cp-light" color="#FFFF00">
</image>
<image class="colorpickertile cp-light" color="#33FF33">
</image>
<image class="colorpickertile" color="#66CCCC">
</image>
<image class="colorpickertile" color="#33CCFF">
</image>
<image class="colorpickertile" color="#6666CC">
</image>
<image class="colorpickertile" color="#CC66CC">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#999999">
</image>
<image class="colorpickertile" color="#CC0000">
</image>
<image class="colorpickertile" color="#FF6600">
</image>
<image class="colorpickertile" color="#FFCC33">
</image>
<image class="colorpickertile" color="#FFCC00">
</image>
<image class="colorpickertile" color="#33CC00">
</image>
<image class="colorpickertile" color="#00CCCC">
</image>
<image class="colorpickertile" color="#3366FF">
</image>
<image class="colorpickertile" color="#6633FF">
</image>
<image class="colorpickertile" color="#CC33CC">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#666666">
</image>
<image class="colorpickertile" color="#990000">
</image>
<image class="colorpickertile" color="#CC6600">
</image>
<image class="colorpickertile" color="#CC9933">
</image>
<image class="colorpickertile" color="#999900">
</image>
<image class="colorpickertile" color="#009900">
</image>
<image class="colorpickertile" color="#339999">
</image>
<image class="colorpickertile" color="#3333FF">
</image>
<image class="colorpickertile" color="#6600CC">
</image>
<image class="colorpickertile" color="#993399">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#333333">
</image>
<image class="colorpickertile" color="#660000">
</image>
<image class="colorpickertile" color="#993300">
</image>
<image class="colorpickertile" color="#996633">
</image>
<image class="colorpickertile" color="#666600">
</image>
<image class="colorpickertile" color="#006600">
</image>
<image class="colorpickertile" color="#336666">
</image>
<image class="colorpickertile" color="#000099">
</image>
<image class="colorpickertile" color="#333399">
</image>
<image class="colorpickertile" color="#663366">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#000000">
</image>
<image class="colorpickertile" color="#330000">
</image>
<image class="colorpickertile" color="#663300">
</image>
<image class="colorpickertile" color="#663333">
</image>
<image class="colorpickertile" color="#333300">
</image>
<image class="colorpickertile" color="#003300">
</image>
<image class="colorpickertile" color="#003333">
</image>
<image class="colorpickertile" color="#000066">
</image>
<image class="colorpickertile" color="#330099">
</image>
<image class="colorpickertile" color="#330033">
</image>
</hbox>
</vbox>`;
    let comment = document.createComment("Creating xbl-colorpicker");
    this.prepend(comment);

    try {
      this.initialize();
    } catch (e) {}
  }
  disconnectedCallback() {}

  set color(val) {
    if (!val) return val;
    var uppercaseVal = val.toUpperCase();
    // Translate standard HTML color strings:
    if (uppercaseVal[0] != "#") {
      switch (uppercaseVal) {
        case "GREEN":
          uppercaseVal = "#008000";
          break;
        case "LIME":
          uppercaseVal = "#00FF00";
          break;
        case "OLIVE":
          uppercaseVal = "#808000";
          break;
        case "TEAL":
          uppercaseVal = "#008080";
          break;
        case "YELLOW":
          uppercaseVal = "#FFFF00";
          break;
        case "RED":
          uppercaseVal = "#FF0000";
          break;
        case "MAROON":
          uppercaseVal = "#800000";
          break;
        case "PURPLE":
          uppercaseVal = "#800080";
          break;
        case "FUCHSIA":
          uppercaseVal = "#FF00FF";
          break;
        case "NAVY":
          uppercaseVal = "#000080";
          break;
        case "BLUE":
          uppercaseVal = "#0000FF";
          break;
        case "AQUA":
          uppercaseVal = "#00FFFF";
          break;
        case "WHITE":
          uppercaseVal = "#FFFFFF";
          break;
        case "SILVER":
          uppercaseVal = "#C0C0C0";
          break;
        case "GRAY":
          uppercaseVal = "#808080";
          break;
        default:
          // BLACK
          uppercaseVal = "#000000";
          break;
      }
    }
    var cells = this.mBox.getElementsByAttribute("color", uppercaseVal);
    if (cells.item(0)) {
      this.selectCell(cells[0]);
      this.hoverCell(this.mSelectedCell);
    }
    return val;
  }

  get color() {
    return this.mSelectedCell ? this.mSelectedCell.getAttribute("color") : null;
  }
  initColor(aColor) {
    // Use this to initialize color without
    //  triggering the "onselect" handler,
    //  which closes window when it's a popup
    this.mDoOnSelect = false;
    this.color = aColor;
    this.mDoOnSelect = true;
  }
  initialize() {
    this.mSelectedCell = null;
    this.mHoverCell = null;
    this.mBox = document.getAnonymousNodes(this)[0];
    this.mIsPopup = false;
    this.mDoOnSelect = true;

    let imageEls = this.mBox.querySelectorAll("image");
    // We set the background of the picker tiles here using images in
    // order for the color to show up even when author colors are
    // disabled or the user is using high contrast mode.
    for (let el of imageEls) {
      let dataURI =
        "data:image/svg+xml,<svg style='background-color: " +
        encodeURIComponent(el.getAttribute("color")) +
        "' xmlns='http://www.w3.org/2000/svg' />";
      el.setAttribute("src", dataURI);
    }

    this.hoverCell(this.mBox.childNodes[0].childNodes[0]);

    // used to capture keydown at the document level
    this.mPickerKeyDown = function(aEvent) {
      document._focusedPicker.pickerKeyDown(aEvent);
    };
  }
  _fireEvent(aTarget, aEventName) {
    try {
      var event = document.createEvent("Events");
      event.initEvent(aEventName, true, true);
      var cancel = !aTarget.dispatchEvent(event);
      if (aTarget.hasAttribute("on" + aEventName)) {
        var fn = new Function("event", aTarget.getAttribute("on" + aEventName));
        var rv = fn.call(aTarget, event);
        if (rv == false) cancel = true;
      }
      return !cancel;
    } catch (e) {
      Components.utils.reportError(e);
    }
    return false;
  }
  resetHover() {
    if (this.mHoverCell) this.mHoverCell.removeAttribute("hover");
  }
  getColIndex(aCell) {
    var cell = aCell;
    var idx;
    for (idx = -1; cell; idx++) cell = cell.previousSibling;

    return idx;
  }
  isColorCell(aCell) {
    return aCell && aCell.hasAttribute("color");
  }
  hoverLeft() {
    var cell = this.mHoverCell.previousSibling;
    this.hoverCell(cell);
  }
  hoverRight() {
    var cell = this.mHoverCell.nextSibling;
    this.hoverCell(cell);
  }
  hoverUp() {
    var row = this.mHoverCell.parentNode.previousSibling;
    if (row) {
      var colIdx = this.getColIndex(this.mHoverCell);
      var cell = row.childNodes[colIdx];
      this.hoverCell(cell);
    }
  }
  hoverDown() {
    var row = this.mHoverCell.parentNode.nextSibling;
    if (row) {
      var colIdx = this.getColIndex(this.mHoverCell);
      var cell = row.childNodes[colIdx];
      this.hoverCell(cell);
    }
  }
  hoverTo(aRow, aCol) {
    var row = this.mBox.childNodes[aRow];
    if (!row) return;
    var cell = row.childNodes[aCol];
    if (!cell) return;
    this.hoverCell(cell);
  }
  hoverCell(aCell) {
    if (this.isColorCell(aCell)) {
      this.resetHover();
      aCell.setAttribute("hover", "true");
      this.mHoverCell = aCell;
      var event = document.createEvent("Events");
      event.initEvent("DOMMenuItemActive", true, true);
      aCell.dispatchEvent(event);
    }
  }
  selectHoverCell() {
    this.selectCell(this.mHoverCell);
  }
  selectCell(aCell) {
    if (this.isColorCell(aCell)) {
      if (this.mSelectedCell) this.mSelectedCell.removeAttribute("selected");

      this.mSelectedCell = aCell;
      aCell.setAttribute("selected", "true");

      if (this.mDoOnSelect) this._fireEvent(this, "select");
    }
  }
  handleEvent(aEvent) {
    switch (aEvent.keyCode) {
      case 37: // left
        this.hoverLeft();
        break;
      case 38: // up
        this.hoverUp();
        break;
      case 39: // right
        this.hoverRight();
        break;
      case 40: // down
        this.hoverDown();
        break;
      case 13: // enter
      case 32: // space
        this.selectHoverCell();
        break;
    }
  }
}
customElements.define("xbl-colorpicker", XblColorpicker);
