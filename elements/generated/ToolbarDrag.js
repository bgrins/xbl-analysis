class XblToolbarDrag extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbar-drag");
    this.prepend(comment);

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
customElements.define("xbl-toolbar-drag", XblToolbarDrag);
