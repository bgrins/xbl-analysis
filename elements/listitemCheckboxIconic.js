class XblListitemCheckboxIconic extends XblListitemCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listitem-checkbox-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-listitem-checkbox-iconic",
  XblListitemCheckboxIconic
);
