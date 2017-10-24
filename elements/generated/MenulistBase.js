class FirefoxMenulistBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menulist-base", FirefoxMenulistBase);
