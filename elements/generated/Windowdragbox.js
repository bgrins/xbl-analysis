class FirefoxWindowdragbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-windowdragbox");
    this.prepend(comment);

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
  }
  disconnectedCallback() {}
}
customElements.define("firefox-windowdragbox", FirefoxWindowdragbox);
