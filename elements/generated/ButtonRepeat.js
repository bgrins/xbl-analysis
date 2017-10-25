class FirefoxButtonRepeat extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define("firefox-button-repeat", FirefoxButtonRepeat);
