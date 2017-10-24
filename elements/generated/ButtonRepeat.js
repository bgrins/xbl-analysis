class FirefoxButtonRepeat extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define("firefox-button-repeat", FirefoxButtonRepeat);
