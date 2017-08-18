class FirefoxMenulistBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menulist-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menulist-base", FirefoxMenulistBase);
