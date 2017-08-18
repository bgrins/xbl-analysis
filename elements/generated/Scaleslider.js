class FirefoxScaleslider extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-scaleslider");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scaleslider", FirefoxScaleslider);
