class FirefoxWindowdragbox extends XULElement {
  connectedCallback() {

    this._dragBindingAlive = true;

    if (!this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        ChromeUtils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
        let draghandle = new tmp.WindowDraggingElement(this);
        draghandle.mouseDownCheck = function() {
          return this._dragBindingAlive;
        };
      } catch (e) {}
    }

  }

}