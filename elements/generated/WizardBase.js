class FirefoxWizardBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-wizard-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-wizard-base", FirefoxWizardBase);
