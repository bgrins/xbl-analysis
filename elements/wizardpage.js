class XblWizardpage extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-wizardpage");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizardpage", XblWizardpage);
