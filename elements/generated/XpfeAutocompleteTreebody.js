class FirefoxXpfeAutocompleteTreebody extends XULElement {
  connectedCallback() {
    Object.defineProperty(this, "popup", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.popup;
        return (this.popup = document.getBindingParent(this));
      },
      set(val) {
        delete this.popup;
        return (this.popup = val);
      }
    });
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

    this.addEventListener("mouseout", event => {
      this.popup.selectedIndex = -1;
    });

    this.addEventListener("mouseup", event => {
      var rc = this.parentNode.treeBoxObject.getRowAt(
        event.clientX,
        event.clientY
      );
      if (rc != -1) {
        this.popup.selectedIndex = rc;
        this.popup.view.handleEnter(true);
      }
    });

    this.addEventListener("mousemove", event => {
      if (Date.now() - this.mLastMoveTime > 30) {
        var rc = this.parentNode.treeBoxObject.getRowAt(
          event.clientX,
          event.clientY
        );
        if (rc != -1 && rc != this.popup.selectedIndex)
          this.popup.selectedIndex = rc;
        this.mLastMoveTime = Date.now();
      }
    });
  }
}
customElements.define(
  "firefox-xpfe-autocomplete-treebody",
  FirefoxXpfeAutocompleteTreebody
);
