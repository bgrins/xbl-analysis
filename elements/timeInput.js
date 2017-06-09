class XblTimeInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-time-input ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-time-input", XblTimeInput);
