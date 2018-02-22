class FirefoxIframe extends XULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  get docShell() {
    let { frameLoader } = this;
    return frameLoader ? frameLoader.docShell : null;
  }

  get contentWindow() {
    return this.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
  }

  get webNavigation() {
    return this.docShell.QueryInterface(Components.interfaces.nsIWebNavigation);
  }

  get contentDocument() {
    return this.webNavigation.document;
  }

  _setupEventListeners() {

  }
}