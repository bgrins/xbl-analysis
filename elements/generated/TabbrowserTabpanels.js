class FirefoxTabbrowserTabpanels extends FirefoxTabpanels {
  connectedCallback() {
    super.connectedCallback();

    this._selectedIndex = 0;
  }

  set selectedIndex(val) {
    if (val < 0 || val >= this.childNodes.length) return val;

    let toTab = this.getRelatedElement(this.childNodes[val]);

    gBrowser._getSwitcher().requestTab(toTab);

    var panel = this._selectedPanel;
    var newPanel = this.childNodes[val];
    this._selectedPanel = newPanel;
    if (this._selectedPanel != panel) {
      var event = document.createEvent("Events");
      event.initEvent("select", true, true);
      this.dispatchEvent(event);

      this._selectedIndex = val;
    }

    return val;
  }

  get selectedIndex() {
    return this._selectedIndex;
  }
}
customElements.define(
  "firefox-tabbrowser-tabpanels",
  FirefoxTabbrowserTabpanels
);
