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

    this.addEventListener(
      "underflow",
      event => {
        if (event.originalTarget != this._scrollbox) return;

        // Ignore vertical events
        if (event.detail == 0) return;

        var tabs = document.getBindingParent(this);
        tabs.removeAttribute("overflow");

        if (tabs._lastTabClosedByMouse)
          tabs._expandSpacerBy(this._scrollButtonDown.clientWidth);

        for (let tab of Array.from(tabs.tabbrowser._removingTabs))
          tabs.tabbrowser.removeTab(tab);

        tabs._positionPinnedTabs();
      },
      true
    );

    this.addEventListener("overflow", event => {
      if (event.originalTarget != this._scrollbox) return;

      // Ignore vertical events
      if (event.detail == 0) return;

      var tabs = document.getBindingParent(this);
      tabs.setAttribute("overflow", "true");
      tabs._positionPinnedTabs();
      tabs._handleTabSelect(true);
    });
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
