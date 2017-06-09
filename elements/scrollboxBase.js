class XblScrollboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-scrollbox-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox-base", XblScrollboxBase);
