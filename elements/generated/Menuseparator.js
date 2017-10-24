class FirefoxMenuseparator extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menuseparator", FirefoxMenuseparator);
