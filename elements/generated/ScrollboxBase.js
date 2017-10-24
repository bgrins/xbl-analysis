class FirefoxScrollboxBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scrollbox-base", FirefoxScrollboxBase);
