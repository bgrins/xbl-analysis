class ToolbarDrag extends MozXULElement {
  connectedCallback() {

    this._dragBindingAlive = true;

    if (!this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        ChromeUtils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
        let draggableThis = new tmp.WindowDraggingElement(this);
        draggableThis.mouseDownCheck = function(e) {
          // Don't move while customizing.
          return this._dragBindingAlive &&
            this.getAttribute("customizing") != "true";
        };
      } catch (e) {}
    }

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}