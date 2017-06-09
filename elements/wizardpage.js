class XblWizardpage extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-wizardpage";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizardpage", XblWizardpage);
