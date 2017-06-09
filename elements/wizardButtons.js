class XblWizardButtons extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-wizard-buttons";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-buttons", XblWizardButtons);
