class FirefoxHandlerBase extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback();
  }

  get type() {
    return this.getAttribute("type");
  }
}
customElements.define("firefox-handler-base", FirefoxHandlerBase);
