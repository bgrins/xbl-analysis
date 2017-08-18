class FirefoxScrollboxBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-scrollbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scrollbox-base", FirefoxScrollboxBase);
