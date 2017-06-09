class XblListcellCheckboxIconic extends XblListcellCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listcell-checkbox-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-listcell-checkbox-iconic",
  XblListcellCheckboxIconic
);
