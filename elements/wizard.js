class XblWizard extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-wizard";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard", XblWizard);
