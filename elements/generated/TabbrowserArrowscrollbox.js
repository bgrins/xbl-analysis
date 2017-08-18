class XblTabbrowserArrowscrollbox extends XblArrowscrollboxClicktoscroll {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-tabbrowser-arrowscrollbox"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _getScrollableElements() {
    return Array.filter(
      document.getBindingParent(this).childNodes,
      this._canScrollToElement,
      this
    );
  }
  _canScrollToElement(tab) {
    return !tab.pinned && !tab.hidden;
  }
}
customElements.define(
  "xbl-tabbrowser-arrowscrollbox",
  XblTabbrowserArrowscrollbox
);
