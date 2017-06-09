class XblListcell extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listcell";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell", XblListcell);
