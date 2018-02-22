class FirefoxHandlerBase extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  get type() {
    return this.getAttribute("type");
  }

  _setupEventListeners() {

  }
}