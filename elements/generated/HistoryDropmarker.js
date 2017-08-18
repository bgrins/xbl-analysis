class FirefoxHistoryDropmarker extends FirefoxDropmarker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-history-dropmarker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-history-dropmarker", FirefoxHistoryDropmarker);
