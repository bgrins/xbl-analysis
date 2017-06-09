class XblListitem extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listitem";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem", XblListitem);
