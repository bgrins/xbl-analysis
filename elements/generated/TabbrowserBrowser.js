class FirefoxTabbrowserBrowser extends FirefoxBrowser {
  connectedCallback() {
    super.connectedCallback();

    this.tabModalPromptBox = null;
  }

  loadURIWithFlags(aURI, aFlags, aReferrerURI, aCharset, aPostData) {
    var params = arguments[1];
    if (typeof params == "number") {
      params = {
        flags: aFlags,
        referrerURI: aReferrerURI,
        charset: aCharset,
        postData: aPostData
      };
    }
    _loadURIWithFlags(this, aURI, params);
  }
}
customElements.define("firefox-tabbrowser-browser", FirefoxTabbrowserBrowser);
