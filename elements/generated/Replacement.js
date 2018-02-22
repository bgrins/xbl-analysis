class FirefoxReplacement extends FirefoxPluginproblem {
  connectedCallback() {
    super.connectedCallback()

    this.dispatchEvent(new CustomEvent("PluginPlaceholderReplaced"));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}