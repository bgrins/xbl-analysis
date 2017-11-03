class FirefoxReplacement extends FirefoxPluginproblem {
  connectedCallback() {
    super.connectedCallback();

    this.dispatchEvent(new CustomEvent("PluginPlaceholderReplaced"));
  }
}
customElements.define("firefox-replacement", FirefoxReplacement);
