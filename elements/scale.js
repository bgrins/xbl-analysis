class XblScale extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-scale";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scale", XblScale);
