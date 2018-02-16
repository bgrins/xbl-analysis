class FirefoxHandlerBase extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback()

    this.setupHandlers();
  }

  get type() {
    return this.getAttribute("type");
  }

  setupHandlers() {

  }
}