class XblDatepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-datepicker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker", XblDatepicker);
