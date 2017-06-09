class XblTimepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-timepicker";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timepicker", XblTimepicker);
