class FirefoxHistoryDropmarker extends FirefoxDropmarker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-history-dropmarker");
    this.prepend(comment);

    this.addEventListener("mousedown", event => {
      document.getBindingParent(this).toggleHistoryPopup();
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-history-dropmarker", FirefoxHistoryDropmarker);
