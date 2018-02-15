class FirefoxCustomizableuiToolbarDrag extends FirefoxToolbar {
  connectedCallback() {
    super.connectedCallback()

    this._dragBindingAlive = true;

    if (!this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        ChromeUtils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
        let draggableThis = new tmp.WindowDraggingElement(this);
        draggableThis.mouseDownCheck = function(e) {
          return this._dragBindingAlive;
        };
      } catch (e) {}
    }

  }

}