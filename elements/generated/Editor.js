class FirefoxEditor extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-editor");
    this.prepend(comment);

    try {
      // Make window editable immediately only
      //   if the "editortype" attribute is supplied
      // This allows using same contentWindow for different editortypes,
      //   where the type is determined during the apps's window.onload handler.
      if (this.editortype) this.makeEditable(this.editortype, true);
    } catch (e) {}
    this._editorContentListener = {
      QueryInterface(iid) {
        if (
          iid.equals(Components.interfaces.nsIURIContentListener) ||
          iid.equals(Components.interfaces.nsISupportsWeakReference) ||
          iid.equals(Components.interfaces.nsISupports)
        )
          return this;

        throw Components.results.NS_ERROR_NO_INTERFACE;
      },
      onStartURIOpen(uri) {
        return false;
      },
      doContent(contentType, isContentPreferred, request, contentHandler) {
        return false;
      },
      isPreferred(contentType, desiredContentType) {
        return false;
      },
      canHandleContent(contentType, isContentPreferred, desiredContentType) {
        return false;
      },
      loadCookie: null,
      parentContentListener: null
    };
    this._finder = null;
    this._fastFind = null;
    this._lastSearchString = null;
  }
  disconnectedCallback() {}

  get finder() {
    if (!this._finder) {
      if (!this.docShell) return null;

      let Finder = Components.utils.import(
        "resource://gre/modules/Finder.jsm",
        {}
      ).Finder;
      this._finder = new Finder(this.docShell);
    }
    return this._finder;
  }

  get fastFind() {
    if (!this._fastFind) {
      if (!("@mozilla.org/typeaheadfind;1" in Components.classes)) return null;

      if (!this.docShell) return null;

      this._fastFind = Components.classes[
        "@mozilla.org/typeaheadfind;1"
      ].createInstance(Components.interfaces.nsITypeAheadFind);
      this._fastFind.init(this.docShell);
    }
    return this._fastFind;
  }

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

  get docShell() {
    let frameLoader = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    ).frameLoader;
    return frameLoader ? frameLoader.docShell : null;
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

  get messageManager() {
    var owner = this.QueryInterface(Components.interfaces.nsIFrameLoaderOwner);
    if (!owner.frameLoader) {
      return null;
    }
    return owner.frameLoader.messageManager;
  }

  get outerWindowID() {
    return this.contentWindow
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(Components.interfaces.nsIDOMWindowUtils).outerWindowID;
  }
  makeEditable(editortype, waitForUrlLoad) {
    this.editingSession.makeWindowEditable(
      this.contentWindow,
      editortype,
      waitForUrlLoad,
      true,
      false
    );
    this.setAttribute("editortype", editortype);

    this.docShell
      .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
      .getInterface(
        Components.interfaces.nsIURIContentListener
      ).parentContentListener = this._editorContentListener;
  }
  getEditor(containingWindow) {
    return this.editingSession.getEditorForWindow(containingWindow);
  }
  getHTMLEditor(containingWindow) {
    var editor = this.editingSession.getEditorForWindow(containingWindow);
    return editor.QueryInterface(Components.interfaces.nsIHTMLEditor);
  }
}
customElements.define("firefox-editor", FirefoxEditor);
