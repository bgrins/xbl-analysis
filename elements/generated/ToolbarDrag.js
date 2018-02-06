class FirefoxToolbarDrag extends FirefoxToolbar {
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "_dragBindingAlive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = true);
      },
      set(val) {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = val);
      }
    });

    if (!this._draggableStarted) {
      this._draggableStarted = true;
      try {
        let tmp = {};
        ChromeUtils.import(
          "resource://gre/modules/WindowDraggingUtils.jsm",
          tmp
        );
        let draggableThis = new tmp.WindowDraggingElement(this);
        draggableThis.mouseDownCheck = function(e) {
          // Don't move while customizing.
          return (
            this._dragBindingAlive && this.getAttribute("customizing") != "true"
          );
        };
      } catch (e) {}
    }
  }
}
customElements.define("firefox-toolbar-drag", FirefoxToolbarDrag);
