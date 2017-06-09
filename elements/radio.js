class XblRadio extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-radio";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-radio", XblRadio);
