class FirefoxCheckbox extends FirefoxCheckboxBaseline {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define("firefox-checkbox", FirefoxCheckbox);
