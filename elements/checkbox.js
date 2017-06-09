class XblCheckbox extends XblCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-checkbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-checkbox", XblCheckbox);
