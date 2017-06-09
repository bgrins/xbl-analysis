class XblTabpanels extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-tabpanels");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabpanels", XblTabpanels);
