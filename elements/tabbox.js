class XblTabbox extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tabbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabbox", XblTabbox);
