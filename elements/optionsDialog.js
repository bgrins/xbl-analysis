class XblOptionsdialog extends XblDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-optionsdialog";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-optionsdialog", XblOptionsdialog);
