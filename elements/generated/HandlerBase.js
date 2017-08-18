class FirefoxHandlerBase extends FirefoxRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-handler-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get type() {
    return this.getAttribute("type");
  }
}
customElements.define("firefox-handler-base", FirefoxHandlerBase);
