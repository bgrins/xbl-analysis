class FirefoxTabbrowserArrowscrollbox extends FirefoxArrowscrollboxClicktoscroll {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  /**
   * Override scrollbox.xml method, since our scrollbox's children are
   * inherited from the binding parent
   */
  _getScrollableElements() {
    return Array.filter(document.getBindingParent(this).childNodes,
      this._canScrollToElement, this);
  }

  _canScrollToElement(tab) {
    return !tab._pinnedUnscrollable && !tab.hidden;
  }

  _setupEventListeners() {
    this.addEventListener("underflow", (event) => {
      // Ignore underflow events:
      // - from nested scrollable elements
      // - for vertical orientation
      // - corresponding to an overflow event that we ignored
      let tabs = document.getBindingParent(this);
      if (event.originalTarget != this._scrollbox ||
        event.detail == 0 ||
        !tabs.hasAttribute("overflow")) {
        return;
      }

      tabs.removeAttribute("overflow");

      if (tabs._lastTabClosedByMouse) {
        tabs._expandSpacerBy(this._scrollButtonDown.clientWidth);
      }

      for (let tab of Array.from(gBrowser._removingTabs)) {
        gBrowser.removeTab(tab);
      }

      tabs._positionPinnedTabs();
    }, true);

    this.addEventListener("overflow", (event) => {
      // Ignore overflow events:
      // - from nested scrollable elements
      // - for vertical orientation
      // - when the window is tiny initially
      if (event.originalTarget != this._scrollbox ||
        event.detail == 0 ||
        window.outerWidth <= 1) {
        return;
      }

      var tabs = document.getBindingParent(this);
      tabs.setAttribute("overflow", "true");
      tabs._positionPinnedTabs();
      tabs._handleTabSelect(true);
    });

  }
}