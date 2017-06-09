class XblDatepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-datepicker";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker", XblDatepicker);
