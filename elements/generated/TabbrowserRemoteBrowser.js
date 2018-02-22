class FirefoxTabbrowserRemoteBrowser extends FirefoxRemoteBrowser {
  connectedCallback() {
    super.connectedCallback()

    this.tabModalPromptBox = null;

    this._setupEventListeners();
  }
  loadURIWithFlags(aURI, aFlags, aReferrerURI, aCharset, aPostData) {
    var params = arguments[1];
    if (typeof(params) == "number") {
      params = {
        flags: aFlags,
        referrerURI: aReferrerURI,
        charset: aCharset,
        postData: aPostData,
      };
    }
    _loadURIWithFlags(this, aURI, params);
  }

  _setupEventListeners() {

  }
}