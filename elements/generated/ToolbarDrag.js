class FirefoxToolbarDrag extends FirefoxToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-toolbar-drag");
    this.prepend(comment);

    Object.defineProperty(this, "_dragBindingAlive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = true);
      }
    });

    try {
      if (!this._draggableStarted) {
        this._draggableStarted = true;
        try {
          let tmp = {};
          Components.utils.import(
            "resource://gre/modules/WindowDraggingUtils.jsm",
            tmp
          );
          let draggableThis = new tmp.WindowDraggingElement(this);
          draggableThis.mouseDownCheck = function(e) {
            // Don't move while customizing.
            return (
              this._dragBindingAlive &&
              this.getAttribute("customizing") != "true"
            );
          };
        } catch (e) {}
      }
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbar-drag", FirefoxToolbarDrag);
