class XblBrowser extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>`;
    let comment = document.createComment("Creating xbl-browser");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get canGoBack() {
    return this.webNavigation.canGoBack;
  }

  get canGoForward() {
    return this.webNavigation.canGoForward;
  }

  get documentURI() {
    return this.contentDocument.documentURIObject;
  }

  get documentContentType() {
    return this.contentDocument ? this.contentDocument.contentType : null;
  }

  get preferences() {
    return this.mPrefs.QueryInterface(Components.interfaces.nsIPrefService);
  }

  get autoCompletePopup() {
    return document.getElementById(this.getAttribute("autocompletepopup"));
  }

  get dateTimePicker() {
    return document.getElementById(this.getAttribute("datetimepicker"));
  }

  get isRemoteBrowser() {
    return this.getAttribute("remote") == "true";
  }

  get webProgress() {
    return this.docShell
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsIWebProgress);
  }

  get contentWindow() {
    return (
      this._contentWindow ||
      (this._contentWindow = this.docShell
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIDOMWindow))
    );
  }

  get contentWindowAsCPOW() {
    return this.contentWindow;
  }

  get sessionHistory() {
    return this.webNavigation.sessionHistory;
  }

  get markupDocumentViewer() {
    return this.docShell.contentViewer;
  }

  get contentViewerEdit() {
    return this.docShell.contentViewer.QueryInterface(
      Components.interfaces.nsIContentViewerEdit
    );
  }

  get contentViewerFile() {
    return this.docShell.contentViewer.QueryInterface(
      Components.interfaces.nsIContentViewerFile
    );
  }

  get contentDocument() {
    return this.webNavigation.document;
  }

  get contentDocumentAsCPOW() {
    return this.contentDocument;
  }

  get contentTitle() {
    return this.contentDocument.title;
  }

  get characterSet() {
    return this.docShell.charset;
  }

  get mayEnableCharacterEncodingMenu() {
    return this.docShell.mayEnableCharacterEncodingMenu;
  }

  get contentPrincipal() {
    return this.contentDocument.nodePrincipal;
  }

  set showWindowResizer(val) {
    if (val) this.setAttribute("showresizer", "true");
    else this.removeAttribute("showresizer");
    return val;
  }

  get showWindowResizer() {
    return this.getAttribute("showresizer") == "true";
  }

  get pageReport() {
    return this.blockedPopups;
  }

  get audioMuted() {
    return this._audioMuted;
  }

  get audioBlocked() {
    return this._audioBlocked;
  }

  get userTypedValue() {
    return this._userTypedValue;
  }
}
customElements.define("xbl-browser", XblBrowser);
