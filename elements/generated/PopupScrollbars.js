class XblPopupScrollbars extends XblPopup {
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
    let comment = document.createComment("Creating xbl-popup-scrollbars");
    this.prepend(comment);
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
customElements.define("xbl-popup-scrollbars", XblPopupScrollbars);
