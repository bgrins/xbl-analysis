class XblListcellCheckbox extends XblListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listcell-checkbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell-checkbox", XblListcellCheckbox);
