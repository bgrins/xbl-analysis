class XblWizardpage extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-wizardpage ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizardpage", XblWizardpage);
