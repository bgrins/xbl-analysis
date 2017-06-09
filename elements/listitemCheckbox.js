class XblListitemCheckbox extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-listitem-checkbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listitem-checkbox", XblListitemCheckbox);
