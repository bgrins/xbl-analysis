class XblTabpanels extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tabpanels";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabpanels", XblTabpanels);
