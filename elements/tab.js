class XblTab extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tab";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tab", XblTab);
