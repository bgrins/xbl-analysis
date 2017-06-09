class XblCheckboxBaseline extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-checkbox-baseline";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox-baseline", XblCheckboxBaseline);
