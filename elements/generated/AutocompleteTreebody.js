class FirefoxAutocompleteTreebody extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    Object.defineProperty(this, "mLastMoveTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = Date.now());
      },
      set(val) {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = val);
      }
    });

    this.addEventListener("mouseup", event => {
      this.parentNode.parentNode.onPopupClick(event);
    });

    this.addEventListener("mousedown", event => {
      var rc = this.parentNode.treeBoxObject.getRowAt(
        event.clientX,
        event.clientY
      );
      if (rc != this.parentNode.currentIndex)
        this.parentNode.view.selection.select(rc);
    });

    this.addEventListener("mousemove", event => {
      if (event.defaultPrevented) {
        // Allow bindings that extend this one to cancel the event so that
        // nothing is selected.
        return;
      }
      if (Date.now() - this.mLastMoveTime > 30) {
        var rc = this.parentNode.treeBoxObject.getRowAt(
          event.clientX,
          event.clientY
        );
        if (rc != this.parentNode.currentIndex)
          this.parentNode.view.selection.select(rc);
        this.mLastMoveTime = Date.now();
      }
    });
  }
}
customElements.define(
  "firefox-autocomplete-treebody",
  FirefoxAutocompleteTreebody
);
