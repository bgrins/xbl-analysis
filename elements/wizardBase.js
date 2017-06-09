class XblWizardBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-wizard-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-base", XblWizardBase);
