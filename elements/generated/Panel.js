class FirefoxPanel extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-panel");
    this.prepend(comment);

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
    this._prevFocus = 0;
    this._dragBindingAlive = true;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-panel", FirefoxPanel);
