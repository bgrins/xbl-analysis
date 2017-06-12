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
}
customElements.define("xbl-tabpanels", XblTabpanels);
