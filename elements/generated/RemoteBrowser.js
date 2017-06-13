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
customElements.define("xbl-remote-browser", XblRemoteBrowser);
