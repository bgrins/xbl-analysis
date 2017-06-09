class XblDateInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-date-input ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-date-input", XblDateInput);
