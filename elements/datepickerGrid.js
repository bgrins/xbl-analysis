class XblDatepickerGrid extends XblDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-datepicker-grid";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker-grid", XblDatepickerGrid);
