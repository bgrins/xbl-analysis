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
}
customElements.define("xbl-tabbox", XblTabbox);
