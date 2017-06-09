class XblDateInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-date-input";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-date-input", XblDateInput);
