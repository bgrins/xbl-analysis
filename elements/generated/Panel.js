class FirefoxPanel extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-panel");
    this.prepend(comment);

    Object.defineProperty(this, "_prevFocus", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._prevFocus;
        return (this._prevFocus = 0);
      },
      set(val) {
        delete this["_prevFocus"];
        return (this["_prevFocus"] = val);
      }
    });
    Object.defineProperty(this, "_dragBindingAlive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragBindingAlive;
        return (this._dragBindingAlive = true);
      },
      set(val) {
        delete this["_dragBindingAlive"];
        return (this["_dragBindingAlive"] = val);
      }
    });

    try {
      if (this.getAttribute("backdrag") == "true" && !this._draggableStarted) {
        this._draggableStarted = true;
        try {
          let tmp = {};
          Components.utils.import(
            "resource://gre/modules/WindowDraggingUtils.jsm",
            tmp
          );
          let draghandle = new tmp.WindowDraggingElement(this);
          draghandle.mouseDownCheck = function() {
            return this._dragBindingAlive;
          };
        } catch (e) {}
      }
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-panel", FirefoxPanel);
