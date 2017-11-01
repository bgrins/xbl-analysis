class FirefoxTabbrowserTabbox extends FirefoxTabbox {
  connectedCallback() {
    super.connectedCallback();
  }

  get tabs() {
    return document.getBindingParent(this).tabContainer;
  }
}
customElements.define("firefox-tabbrowser-tabbox", FirefoxTabbrowserTabbox);
