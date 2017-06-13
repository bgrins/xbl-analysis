class XblTabpanels extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-tabpanels");
    this.prepend(comment);
  }
  disconnectedCallback() {}
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
customElements.define("xbl-tabpanels", XblTabpanels);
