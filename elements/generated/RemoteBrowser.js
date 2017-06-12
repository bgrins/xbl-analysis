class XblRemoteBrowser extends XblBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-remote-browser");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get webNavigation() {
    return this._remoteWebNavigation;
  }

  get documentURI() {
    return this._documentURI;
  }

  get documentContentType() {
    return this._documentContentType;
  }

  get contentTitle() {
    return this._contentTitle;
  }

  get characterSet() {
    return this._characterSet;
  }

  get mayEnableCharacterEncodingMenu() {
    return this._mayEnableCharacterEncodingMenu;
  }

  get contentWindow() {
    return null;
  }

  get contentWindowAsCPOW() {
    return this._contentWindow;
  }

  get contentDocument() {
    return null;
  }

  get contentPrincipal() {
    return this._contentPrincipal;
  }

  get contentDocumentAsCPOW() {
    return this.contentWindowAsCPOW ? this.contentWindowAsCPOW.document : null;
  }

  get imageDocument() {
    return this._imageDocument;
  }

  get outerWindowID() {
    return this._outerWindowID;
  }

  get manifestURI() {
    return this._manifestURI;
  }
}
customElements.define("xbl-remote-browser", XblRemoteBrowser);
