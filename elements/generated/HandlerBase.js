class FirefoxHandlerBase extends FirefoxRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}

  get type() {
    return this.getAttribute("type");
  }
}
customElements.define("firefox-handler-base", FirefoxHandlerBase);
