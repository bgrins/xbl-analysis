class FirefoxButtonRepeat extends FirefoxButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-button-repeat");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-button-repeat", FirefoxButtonRepeat);
