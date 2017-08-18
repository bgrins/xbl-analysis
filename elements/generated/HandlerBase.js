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
    undefined;
  }
}
customElements.define("firefox-handler-base", FirefoxHandlerBase);
