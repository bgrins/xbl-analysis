class XblEditor extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-editor");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set editortype(val) {
    this.setAttribute("editortype", val);
    return val;
  }

  get editortype() {
    return this.getAttribute("editortype");
  }

  get webNavigation() {
    return this.docShell.QueryInterface(Components.interfaces.nsIWebNavigation);
  }

  get contentDocument() {
    return this.webNavigation.document;
  }

  get currentURI() {
    return this.webNavigation.currentURI;
  }

  get contentWindow() {
    return this.docShell
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsIDOMWindow);
  }

  get contentWindowAsCPOW() {
    return this.contentWindow;
  }

  get webBrowserFind() {
    return this.docShell
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsIWebBrowserFind);
  }

  get markupDocumentViewer() {
    return this.docShell.contentViewer;
  }

  get editingSession() {
    return this.webNavigation
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsIEditingSession);
  }

  get commandManager() {
    return this.webNavigation
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsICommandManager);
  }

  set fullZoom(val) {
    this.markupDocumentViewer.fullZoom = val;
  }

  get fullZoom() {
    return this.markupDocumentViewer.fullZoom;
  }

  set textZoom(val) {
    this.markupDocumentViewer.textZoom = val;
  }

  get textZoom() {
    return this.markupDocumentViewer.textZoom;
  }

  get isSyntheticDocument() {
    return this.contentDocument.isSyntheticDocument;
  }
}
customElements.define("xbl-editor", XblEditor);
