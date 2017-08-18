class FirefoxPopupScrollbars extends FirefoxPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<scrollbox class="popup-internal-box" flex="1" orient="vertical" style="overflow: auto;">
<children>
</children>
</scrollbox>`;
    let comment = document.createComment("Creating firefox-popup-scrollbars");
    this.prepend(comment);

    Object.defineProperty(this, "AUTOSCROLL_INTERVAL", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.AUTOSCROLL_INTERVAL;
        return (this.AUTOSCROLL_INTERVAL = 25);
      }
    });
    Object.defineProperty(this, "NOT_DRAGGING", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.NOT_DRAGGING;
        return (this.NOT_DRAGGING = 0);
      }
    });
    Object.defineProperty(this, "DRAG_OVER_BUTTON", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.DRAG_OVER_BUTTON;
        return (this.DRAG_OVER_BUTTON = -1);
      }
    });
    Object.defineProperty(this, "DRAG_OVER_POPUP", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.DRAG_OVER_POPUP;
        return (this.DRAG_OVER_POPUP = 1);
      }
    });
    Object.defineProperty(this, "_draggingState", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._draggingState;
        return (this._draggingState = this.NOT_DRAGGING);
      }
    });
    Object.defineProperty(this, "_scrollTimer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollTimer;
        return (this._scrollTimer = 0);
      }
    });
  }
  disconnectedCallback() {}
  enableDragScrolling(overItem) {
    if (!this._draggingState) {
      this.setCaptureAlways();
      this._draggingState = overItem
        ? this.DRAG_OVER_POPUP
        : this.DRAG_OVER_BUTTON;
    }
  }
  _clearScrollTimer() {
    if (this._scrollTimer) {
      this.ownerGlobal.clearInterval(this._scrollTimer);
      this._scrollTimer = 0;
    }
  }
}
customElements.define("firefox-popup-scrollbars", FirefoxPopupScrollbars);
