class XblTabbox extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-tabbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get _tabs() {
    return this.tabs;
  }

  get _tabpanels() {
    return this.tabpanels;
  }

  get eventNode() {
    return this._eventNode;
  }
  handleEvent(event) {
    if (!event.isTrusted) {
      // Don't let untrusted events mess with tabs.
      return;
    }

    // Don't check if the event was already consumed because tab
    // navigation should always work for better user experience.

    switch (event.keyCode) {
      case event.DOM_VK_TAB:
        if (event.ctrlKey && !event.altKey && !event.metaKey)
          if (this.tabs && this.handleCtrlTab) {
            this.tabs.advanceSelectedTab(event.shiftKey ? -1 : 1, true);
            event.preventDefault();
          }
        break;
      case event.DOM_VK_PAGE_UP:
        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey)
          if (this.tabs && this.handleCtrlPageUpDown) {
            this.tabs.advanceSelectedTab(-1, true);
            event.preventDefault();
          }
        break;
      case event.DOM_VK_PAGE_DOWN:
        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey)
          if (this.tabs && this.handleCtrlPageUpDown) {
            this.tabs.advanceSelectedTab(1, true);
            event.preventDefault();
          }
        break;
      case event.DOM_VK_LEFT:
        if (event.metaKey && event.altKey && !event.shiftKey && !event.ctrlKey)
          if (this.tabs && this._handleMetaAltArrows) {
            var offset = window.getComputedStyle(this).direction == "ltr"
              ? -1
              : 1;
            this.tabs.advanceSelectedTab(offset, true);
            event.preventDefault();
          }
        break;
      case event.DOM_VK_RIGHT:
        if (event.metaKey && event.altKey && !event.shiftKey && !event.ctrlKey)
          if (this.tabs && this._handleMetaAltArrows) {
            offset = window.getComputedStyle(this).direction == "ltr" ? 1 : -1;
            this.tabs.advanceSelectedTab(offset, true);
            event.preventDefault();
          }
        break;
    }
  }
}
customElements.define("xbl-tabbox", XblTabbox);
