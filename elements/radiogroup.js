class XblRadiogroup extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-radiogroup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-radiogroup", XblRadiogroup);
