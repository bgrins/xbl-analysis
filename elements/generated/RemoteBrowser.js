class FirefoxRemoteBrowser extends FirefoxBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-remote-browser");
    this.prepend(comment);

    Object.defineProperty(this, "_securityUI", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._securityUI;
        return (this._securityUI = null);
      }
    });
    Object.defineProperty(this, "_controller", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._controller;
        return (this._controller = null);
      }
    });
    Object.defineProperty(this, "_selectParentHelper", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._selectParentHelper;
        return (this._selectParentHelper = null);
      }
    });
    Object.defineProperty(this, "_remoteWebNavigation", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._remoteWebNavigation;
        return (this._remoteWebNavigation = null);
      }
    });
    Object.defineProperty(this, "_remoteWebProgress", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._remoteWebProgress;
        return (this._remoteWebProgress = null);
      }
    });
    Object.defineProperty(this, "_remoteFinder", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._remoteFinder;
        return (this._remoteFinder = null);
      }
    });
    Object.defineProperty(this, "_documentURI", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._documentURI;
        return (this._documentURI = null);
      }
    });
    Object.defineProperty(this, "_documentContentType", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._documentContentType;
        return (this._documentContentType = null);
      }
    });
    Object.defineProperty(this, "_contentTitle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._contentTitle;
        return (this._contentTitle = "");
      }
    });
    Object.defineProperty(this, "_characterSet", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._characterSet;
        return (this._characterSet = "");
      }
    });
    Object.defineProperty(this, "_mayEnableCharacterEncodingMenu", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._mayEnableCharacterEncodingMenu;
        return (this._mayEnableCharacterEncodingMenu = null);
      }
    });
    Object.defineProperty(this, "_contentWindow", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._contentWindow;
        return (this._contentWindow = null);
      }
    });
    Object.defineProperty(this, "_contentPrincipal", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._contentPrincipal;
        return (this._contentPrincipal = null);
      }
    });
    Object.defineProperty(this, "_imageDocument", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._imageDocument;
        return (this._imageDocument = null);
      }
    });
    Object.defineProperty(this, "_fullZoom", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._fullZoom;
        return (this._fullZoom = 1);
      }
    });
    Object.defineProperty(this, "_textZoom", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._textZoom;
        return (this._textZoom = 1);
      }
    });
    Object.defineProperty(this, "_isSyntheticDocument", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._isSyntheticDocument;
        return (this._isSyntheticDocument = false);
      }
    });
    Object.defineProperty(this, "_outerWindowID", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._outerWindowID;
        return (this._outerWindowID = null);
      }
    });
    Object.defineProperty(this, "_innerWindowID", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._innerWindowID;
        return (this._innerWindowID = null);
      }
    });
    Object.defineProperty(this, "_manifestURI", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._manifestURI;
        return (this._manifestURI = "");
      }
    });
    Object.defineProperty(this, "mDestroyed", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mDestroyed;
        return (this.mDestroyed = false);
      }
    });
    Object.defineProperty(this, "_permitUnloadId", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._permitUnloadId;
        return (this._permitUnloadId = 0);
      }
    });

    try {
      /*
           * Don't try to send messages from this function. The message manager for
           * the <browser> element may not be initialized yet.
           */

      this._remoteWebNavigation = Components.classes[
        "@mozilla.org/remote-web-navigation;1"
      ].createInstance(Components.interfaces.nsIWebNavigation);
      this._remoteWebNavigationImpl = this._remoteWebNavigation.wrappedJSObject;
      this._remoteWebNavigationImpl.swapBrowser(this);

      // Initialize contentPrincipal to the about:blank principal for this loadcontext
      let { Services } = Components.utils.import(
        "resource://gre/modules/Services.jsm",
        {}
      );
      let aboutBlank = Services.io.newURI("about:blank");
      let ssm = Services.scriptSecurityManager;
      this._contentPrincipal = ssm.getLoadContextCodebasePrincipal(
        aboutBlank,
        this.loadContext
      );

      this.messageManager.addMessageListener("Browser:Init", this);
      this.messageManager.addMessageListener("DOMTitleChanged", this);
      this.messageManager.addMessageListener("ImageDocumentLoaded", this);
      this.messageManager.addMessageListener("FullZoomChange", this);
      this.messageManager.addMessageListener("TextZoomChange", this);
      this.messageManager.addMessageListener("ZoomChangeUsingMouseWheel", this);
      this.messageManager.addMessageListener("DOMFullscreen:RequestExit", this);
      this.messageManager.addMessageListener(
        "DOMFullscreen:RequestRollback",
        this
      );
      this.messageManager.addMessageListener("MozApplicationManifest", this);
      this.messageManager.loadFrameScript(
        "chrome://global/content/browser-child.js",
        true
      );

      if (this.hasAttribute("selectmenulist")) {
        this.messageManager.addMessageListener("Forms:ShowDropDown", this);
        this.messageManager.addMessageListener("Forms:HideDropDown", this);
      }

      if (!this.hasAttribute("disablehistory")) {
        Services.obs.addObserver(this, "browser:purge-session-history", true);
      }

      let jsm = "resource://gre/modules/RemoteController.jsm";
      let RemoteController = Components.utils.import(jsm, {}).RemoteController;
      this._controller = new RemoteController(this);
      this.controllers.appendController(this._controller);
    } catch (e) {}
  }
  disconnectedCallback() {}

  get securityUI() {
    if (!this._securityUI) {
      // Don't attempt to create the remote web progress if the
      // messageManager has already gone away
      if (!this.messageManager) return null;

      let jsm = "resource://gre/modules/RemoteSecurityUI.jsm";
      let RemoteSecurityUI = Components.utils.import(jsm, {}).RemoteSecurityUI;
      this._securityUI = new RemoteSecurityUI();
    }

    // We want to double-wrap the JS implemented interface, so that QI and instanceof works.
    var ptr = Components.classes[
      "@mozilla.org/supports-interface-pointer;1"
    ].createInstance(Components.interfaces.nsISupportsInterfacePointer);
    ptr.data = this._securityUI;
    return ptr.data.QueryInterface(Components.interfaces.nsISecureBrowserUI);
  }

  get webNavigation() {
    return this._remoteWebNavigation;
  }

  get webProgress() {
    if (!this._remoteWebProgress) {
      // Don't attempt to create the remote web progress if the
      // messageManager has already gone away
      if (!this.messageManager) return null;

      let jsm = "resource://gre/modules/RemoteWebProgress.jsm";
      let { RemoteWebProgressManager } = Components.utils.import(jsm, {});
      this._remoteWebProgressManager = new RemoteWebProgressManager(this);
      this._remoteWebProgress = this._remoteWebProgressManager.topLevelWebProgress;
    }
    return this._remoteWebProgress;
  }

  get finder() {
    if (!this._remoteFinder) {
      // Don't attempt to create the remote finder if the
      // messageManager has already gone away
      if (!this.messageManager) return null;

      let jsm = "resource://gre/modules/RemoteFinder.jsm";
      let { RemoteFinder } = Components.utils.import(jsm, {});
      this._remoteFinder = new RemoteFinder(this);
    }
    return this._remoteFinder;
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

  set characterSet(val) {
    this.messageManager.sendAsyncMessage("UpdateCharacterSet", { value: val });
    this._characterSet = val;
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

  set fullZoom(val) {
    let changed = val.toFixed(2) != this._fullZoom.toFixed(2);

    this._fullZoom = val;
    try {
      this.messageManager.sendAsyncMessage("FullZoom", { value: val });
    } catch (ex) {}

    if (changed) {
      let event = new Event("FullZoomChange", { bubbles: true });
      this.dispatchEvent(event);
    }
  }

  get fullZoom() {
    return this._fullZoom;
  }

  set textZoom(val) {
    let changed = val.toFixed(2) != this._textZoom.toFixed(2);

    this._textZoom = val;
    try {
      this.messageManager.sendAsyncMessage("TextZoom", { value: val });
    } catch (ex) {}

    if (changed) {
      let event = new Event("TextZoomChange", { bubbles: true });
      this.dispatchEvent(event);
    }
  }

  get textZoom() {
    return this._textZoom;
  }

  get isSyntheticDocument() {
    return this._isSyntheticDocument;
  }

  get hasContentOpener() {
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    return frameLoader.tabParent.hasContentOpener;
  }

  get outerWindowID() {
    return this._outerWindowID;
  }

  get innerWindowID() {
    return this._innerWindowID;
  }

  set docShellIsActive(val) {
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    frameLoader.tabParent.docShellIsActive = val;
    return val;
  }

  get docShellIsActive() {
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    return frameLoader.tabParent.docShellIsActive;
  }

  get manifestURI() {
    return this._manifestURI;
  }
  _setCurrentURI(aURI) {
    this._remoteWebProgressManager.setCurrentURI(aURI);
  }
  preserveLayers(preserve) {
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    if (frameLoader.tabParent) {
      frameLoader.tabParent.preserveLayers(preserve);
    }
  }
  getInPermitUnload(aCallback) {
    let id = this._permitUnloadId++;
    let mm = this.messageManager;
    mm.sendAsyncMessage("InPermitUnload", { id });
    mm.addMessageListener("InPermitUnload", function listener(msg) {
      if (msg.data.id != id) {
        return;
      }
      aCallback(msg.data.inPermitUnload);
    });
  }
  permitUnload() {
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    let tabParent = frameLoader.tabParent;

    if (!tabParent.hasBeforeUnload) {
      return { permitUnload: true, timedOut: false };
    }

    const kTimeout = 1000;

    let finished = false;
    let responded = false;
    let permitUnload;
    let id = this._permitUnloadId++;
    let mm = this.messageManager;
    let Services = Components.utils.import(
      "resource://gre/modules/Services.jsm",
      {}
    ).Services;

    let msgListener = msg => {
      if (msg.data.id != id) {
        return;
      }
      if (msg.data.kind == "start") {
        responded = true;
        return;
      }
      done(msg.data.permitUnload);
    };

    let observer = subject => {
      if (subject == mm) {
        done(true);
      }
    };

    function done(result) {
      finished = true;
      permitUnload = result;
      mm.removeMessageListener("PermitUnload", msgListener);
      Services.obs.removeObserver(observer, "message-manager-close");
    }

    mm.sendAsyncMessage("PermitUnload", { id });
    mm.addMessageListener("PermitUnload", msgListener);
    Services.obs.addObserver(observer, "message-manager-close");

    let timedOut = false;
    function timeout() {
      if (!responded) {
        timedOut = true;
      }

      // Dispatch something to ensure that the main thread wakes up.
      Services.tm.dispatchToMainThread(function() {});
    }

    let timer = Components.classes["@mozilla.org/timer;1"].createInstance(
      Components.interfaces.nsITimer
    );
    timer.initWithCallback(timeout, kTimeout, timer.TYPE_ONE_SHOT);

    while (!finished && !timedOut) {
      Services.tm.currentThread.processNextEvent(true);
    }

    return { permitUnload, timedOut };
  }
  destroy() {
    // Make sure that any open select is closed.
    if (this._selectParentHelper) {
      let menulist = document.getElementById(
        this.getAttribute("selectmenulist")
      );
      this._selectParentHelper.hide(menulist, this);
    }

    if (this.mDestroyed) return;
    this.mDestroyed = true;

    try {
      this.controllers.removeController(this._controller);
    } catch (ex) {
      // This can fail when this browser element is not attached to a
      // BrowserDOMWindow.
    }

    if (!this.hasAttribute("disablehistory")) {
      let Services = Components.utils.import(
        "resource://gre/modules/Services.jsm",
        {}
      ).Services;
      try {
        Services.obs.removeObserver(this, "browser:purge-session-history");
      } catch (ex) {
        // It's not clear why this sometimes throws an exception.
      }
    }
  }
  receiveMessage(aMessage) {
    let data = aMessage.data;
    switch (aMessage.name) {
      case "Browser:Init":
        this._outerWindowID = data.outerWindowID;
        break;
      case "DOMTitleChanged":
        this._contentTitle = data.title;
        break;
      case "ImageDocumentLoaded":
        this._imageDocument = {
          width: data.width,
          height: data.height
        };
        break;

      case "Forms:ShowDropDown": {
        if (!this._selectParentHelper) {
          this._selectParentHelper = Cu.import(
            "resource://gre/modules/SelectParentHelper.jsm",
            {}
          ).SelectParentHelper;
        }

        let menulist = document.getElementById(
          this.getAttribute("selectmenulist")
        );
        menulist.menupopup.style.direction = data.direction;

        let zoom = Services.prefs.getBoolPref("browser.zoom.full") ||
          this.isSyntheticDocument
          ? this._fullZoom
          : this._textZoom;
        this._selectParentHelper.populate(
          menulist,
          data.options,
          data.selectedIndex,
          zoom,
          data.uaBackgroundColor,
          data.uaColor,
          data.uaSelectBackgroundColor,
          data.uaSelectColor,
          data.selectBackgroundColor,
          data.selectColor,
          data.selectTextShadow
        );
        this._selectParentHelper.open(
          this,
          menulist,
          data.rect,
          data.isOpenedViaTouch
        );
        break;
      }

      case "FullZoomChange": {
        this._fullZoom = data.value;
        let event = document.createEvent("Events");
        event.initEvent("FullZoomChange", true, false);
        this.dispatchEvent(event);
        break;
      }

      case "TextZoomChange": {
        this._textZoom = data.value;
        let event = document.createEvent("Events");
        event.initEvent("TextZoomChange", true, false);
        this.dispatchEvent(event);
        break;
      }

      case "ZoomChangeUsingMouseWheel": {
        let event = document.createEvent("Events");
        event.initEvent("ZoomChangeUsingMouseWheel", true, false);
        this.dispatchEvent(event);
        break;
      }

      case "DOMFullscreen:RequestExit": {
        let windowUtils = window
          .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
          .getInterface(Components.interfaces.nsIDOMWindowUtils);
        windowUtils.exitFullscreen();
        break;
      }

      case "DOMFullscreen:RequestRollback": {
        let windowUtils = window
          .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
          .getInterface(Components.interfaces.nsIDOMWindowUtils);
        windowUtils.remoteFrameFullscreenReverted();
        break;
      }

      case "MozApplicationManifest":
        this._manifestURI = aMessage.data.manifest;
        break;

      default:
        // Delegate to browser.xml.
        return this._receiveMessage(aMessage);
    }
    return undefined;
  }
  enableDisableCommands(
    aAction,
    aEnabledLength,
    aEnabledCommands,
    aDisabledLength,
    aDisabledCommands
  ) {}
  purgeSessionHistory() {
    try {
      this.messageManager.sendAsyncMessage("Browser:PurgeSessionHistory");
    } catch (ex) {
      // This can throw if the browser has started to go away.
      if (ex.result != Components.results.NS_ERROR_NOT_INITIALIZED) {
        throw ex;
      }
    }
    this._remoteWebNavigationImpl.canGoBack = false;
    this._remoteWebNavigationImpl.canGoForward = false;
  }
  createAboutBlankContentViewer(aPrincipal) {
    // Ensure that the content process has the permissions which are
    // needed to create a document with the given principal.
    let permissionPrincipal = BrowserUtils.principalWithMatchingOA(
      aPrincipal,
      this.contentPrincipal
    );
    let { frameLoader } = this.QueryInterface(
      Components.interfaces.nsIFrameLoaderOwner
    );
    frameLoader.tabParent.transmitPermissionsForPrincipal(permissionPrincipal);

    // Create the about blank content viewer in the content process
    this.messageManager.sendAsyncMessage(
      "Browser:CreateAboutBlank",
      aPrincipal
    );
  }
}
customElements.define("firefox-remote-browser", FirefoxRemoteBrowser);
