class XblDatepickerPopup extends XblDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-datepicker-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker-popup", XblDatepickerPopup);
