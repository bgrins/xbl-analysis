class XblWizardBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-wizard-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-base", XblWizardBase);
