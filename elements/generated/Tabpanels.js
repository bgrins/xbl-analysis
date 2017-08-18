class FirefoxTabpanels extends FirefoxTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-tabpanels");
    this.prepend(comment);

    Object.defineProperty(this, "_tabbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._tabbox;
        return (this._tabbox = null);
      }
    });
    Object.defineProperty(this, "_selectedPanel", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._selectedPanel;
        return (this._selectedPanel = this.childNodes.item(this.selectedIndex));
      }
    });
  }
  disconnectedCallback() {}

  get tabbox() {
    // Memoize the result in a field rather than replacing this property,
    // so that it can be reset along with the binding.
    if (this._tabbox) {
      return this._tabbox;
    }

    let parent = this.parentNode;
    while (parent) {
      if (parent.localName == "tabbox") {
        break;
      }
      parent = parent.parentNode;
    }

    return (this._tabbox = parent);
  }

  set selectedIndex(val) {
    if (val < 0 || val >= this.childNodes.length) return val;
    var panel = this._selectedPanel;
    this._selectedPanel = this.childNodes[val];
    this.setAttribute("selectedIndex", val);
    if (this._selectedPanel != panel) {
      var event = document.createEvent("Events");
      event.initEvent("select", true, true);
      this.dispatchEvent(event);
    }
    return val;
  }

  get selectedIndex() {
    var indexStr = this.getAttribute("selectedIndex");
    return indexStr ? parseInt(indexStr) : -1;
  }

  set selectedPanel(val) {
    var selectedIndex = -1;
    for (var panel = val; panel != null; panel = panel.previousSibling)
      ++selectedIndex;
    this.selectedIndex = selectedIndex;
    return val;
  }

  get selectedPanel() {
    return this._selectedPanel;
  }
  getRelatedElement(aTabPanelElm) {
    if (!aTabPanelElm) return null;

    let tabboxElm = this.tabbox;
    if (!tabboxElm) return null;

    let tabsElm = tabboxElm.tabs;
    if (!tabsElm) return null;

    // Return tab element having 'linkedpanel' attribute equal to the id
    // of the tab panel or the same index as the tab panel element.
    let tabpanelIdx = Array.indexOf(this.childNodes, aTabPanelElm);
    if (tabpanelIdx == -1) return null;

    let tabElms = tabsElm.childNodes;
    let tabElmFromIndex = tabElms[tabpanelIdx];

    let tabpanelId = aTabPanelElm.id;
    if (tabpanelId) {
      for (let idx = 0; idx < tabElms.length; idx++) {
        var tabElm = tabElms[idx];
        if (tabElm.linkedPanel == tabpanelId) return tabElm;
      }
    }

    return tabElmFromIndex;
  }
}
customElements.define("firefox-tabpanels", FirefoxTabpanels);
