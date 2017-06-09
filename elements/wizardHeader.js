class XblWizardHeader extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-wizard-header";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-header", XblWizardHeader);
