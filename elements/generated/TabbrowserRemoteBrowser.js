class XblTabbrowserRemoteBrowser extends XblRemoteBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-tabbrowser-remote-browser"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
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
customElements.define(
  "xbl-tabbrowser-remote-browser",
  XblTabbrowserRemoteBrowser
);
