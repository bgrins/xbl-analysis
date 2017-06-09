class XblTimeInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-time-input";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-time-input", XblTimeInput);
