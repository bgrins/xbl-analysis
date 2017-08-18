class FirefoxTabbrowserArrowscrollbox extends FirefoxArrowscrollboxClicktoscroll {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-tabbrowser-arrowscrollbox"
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
  "firefox-tabbrowser-arrowscrollbox",
  FirefoxTabbrowserArrowscrollbox
);
