class FirefoxTabbox extends FirefoxTabBase {
  connectedCallback() {
    super.connectedCallback()

    this._handleMetaAltArrows = /Mac/.test(navigator.platform);

    this._eventNode = this;

    switch (this.getAttribute("eventnode")) {
      case "parent":
        this._eventNode = this.parentNode;
        break;
      case "window":
        this._eventNode = window;
        break;
      case "document":
        this._eventNode = document;
        break;
    }
    const nsIEventListenerService =
      Components.interfaces.nsIEventListenerService;
    let els = Components.classes["@mozilla.org/eventlistenerservice;1"]
      .getService(nsIEventListenerService);
    els.addSystemEventListener(this._eventNode, "keydown", this, false);

    this.setupHandlers();
  }

  set handleCtrlTab(val) {
    this.setAttribute("handleCtrlTab", val);
    return val;
  }

  get handleCtrlTab() {
    return (this.getAttribute("handleCtrlTab") != "false");
  }

  get _tabs() {
    return this.tabs;
  }

  get _tabpanels() {
    return this.tabpanels;
  }

  get tabs() {
    if (this.hasAttribute("tabcontainer")) {
      return document.getElementById(this.getAttribute("tabcontainer"));
    }
    return this.getElementsByTagNameNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "tabs").item(0);
  }

  get tabpanels() {
    return this.getElementsByTagNameNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "tabpanels").item(0);
  }

  set selectedIndex(val) {
    var tabs = this.tabs;
    if (tabs)
      tabs.selectedIndex = val;
    this.setAttribute("selectedIndex", val);
    return val;
  }

  get selectedIndex() {
    var tabs = this.tabs;
    return tabs ? tabs.selectedIndex : -1;
  }

  set selectedTab(val) {
    if (val) {
      var tabs = this.tabs;
      if (tabs)
        tabs.selectedItem = val;
    }
    return val;
  }

  get selectedTab() {
    var tabs = this.tabs;
    return tabs && tabs.selectedItem;
  }

  set selectedPanel(val) {
    if (val) {
      var tabpanels = this.tabpanels;
      if (tabpanels)
        tabpanels.selectedPanel = val;
    }
    return val;
  }

  get selectedPanel() {
    var tabpanels = this.tabpanels;
    return tabpanels && tabpanels.selectedPanel;
  }

  set eventNode(val) {
    if (val != this._eventNode) {
      const nsIEventListenerService =
        Components.interfaces.nsIEventListenerService;
      let els = Components.classes["@mozilla.org/eventlistenerservice;1"]
        .getService(nsIEventListenerService);
      els.addSystemEventListener(val, "keydown", this, false);
      els.removeSystemEventListener(this._eventNode, "keydown", this, false);
      this._eventNode = val;
    }
    return val;
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
        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey &&
          this.tabs) {
          this.tabs.advanceSelectedTab(-1, true);
          event.preventDefault();
        }
        break;
      case event.DOM_VK_PAGE_DOWN:
        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey &&
          this.tabs) {
          this.tabs.advanceSelectedTab(1, true);
          event.preventDefault();
        }
        break;
      case event.DOM_VK_LEFT:
        if (event.metaKey && event.altKey && !event.shiftKey && !event.ctrlKey)
          if (this.tabs && this._handleMetaAltArrows) {
            var offset = window.getComputedStyle(this)
              .direction == "ltr" ? -1 : 1;
            this.tabs.advanceSelectedTab(offset, true);
            event.preventDefault();
          }
        break;
      case event.DOM_VK_RIGHT:
        if (event.metaKey && event.altKey && !event.shiftKey && !event.ctrlKey)
          if (this.tabs && this._handleMetaAltArrows) {
            offset = window.getComputedStyle(this)
              .direction == "ltr" ? 1 : -1;
            this.tabs.advanceSelectedTab(offset, true);
            event.preventDefault();
          }
        break;
    }
  }
  disconnectedCallback() {
    const nsIEventListenerService =
      Components.interfaces.nsIEventListenerService;
    let els = Components.classes["@mozilla.org/eventlistenerservice;1"]
      .getService(nsIEventListenerService);
    els.removeSystemEventListener(this._eventNode, "keydown", this, false);
  }

  setupHandlers() {

  }
}