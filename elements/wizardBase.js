class XblWizardBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-wizard-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-base", XblWizardBase);
