class XblTimepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-timepicker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timepicker", XblTimepicker);
