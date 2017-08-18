class FirefoxMenuseparator extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menuseparator");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menuseparator", FirefoxMenuseparator);
