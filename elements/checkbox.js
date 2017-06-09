class XblCheckbox extends XblCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-checkbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox", XblCheckbox);
