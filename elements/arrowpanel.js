class XblArrowpanel extends XblPanel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-arrowpanel";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-arrowpanel", XblArrowpanel);
