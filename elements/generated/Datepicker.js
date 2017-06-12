class XblDatepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-datepicker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker", XblDatepicker);
