/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozBrowser extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <children></children>
    `));
    /**
     * Weak reference to an optional frame loader that can be used to influence
     * process selection for this browser.
     * See nsIBrowser.sameProcessAsFrameLoader.
     */
    this._sameProcessAsFrameLoader = null;

    this._loadContext = null;

    this._webBrowserFind = null;

    this._finder = null;

    this._fastFind = null;

    this._lastSearchString = null;

    this.mPrefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);

    this._mStrBundle = null;

    this.blockedPopups = null;

    this._audioMuted = false;

    this._hasAnyPlayingMediaBeenBlocked = false;

    /**
     * Only send the message "Browser:UnselectedTabHover" when someone requests
     * for the message, which can reduce non-necessary communication.
     */
    this._shouldSendUnselectedTabHover = false;

    this._unselectedTabHoverMessageListenerCount = 0;

    this.urlbarChangeTracker = {
      _startedLoadSinceLastUserTyping: false,

      startedLoad() {
        this._startedLoadSinceLastUserTyping = true;
      },
      finishedLoad() {
        this._startedLoadSinceLastUserTyping = false;
      },
      userTyped() {
        this._startedLoadSinceLastUserTyping = false;
      },
    };

    this._userTypedValue = null;

    this.droppedLinkHandler = null;

    this.mIconURL = null;

    /**
     * This is managed by the tabbrowser
     */
    this.lastURI = null;

    this.mDestroyed = false;

    this._AUTOSCROLL_SNAP = 10;

    this._scrolling = false;

    this._startX = null;

    this._startY = null;

    this._autoScrollPopup = null;

    this._autoScrollNeedsCleanup = false;

    /**
     * These IDs identify the scroll frame being autoscrolled.
     */
    this._autoScrollScrollId = null;

    this._autoScrollPresShellId = null;

    try {
      // |webNavigation.sessionHistory| will have been set by the frame
      // loader when creating the docShell as long as this xul:browser
      // doesn't have the 'disablehistory' attribute set.
      if (this.docShell && this.webNavigation.sessionHistory) {
        var os = Cc["@mozilla.org/observer-service;1"]
          .getService(Ci.nsIObserverService);
        os.addObserver(this, "browser:purge-session-history", true);

        // enable global history if we weren't told otherwise
        if (!this.hasAttribute("disableglobalhistory") && !this.isRemoteBrowser) {
          try {
            this.docShell.useGlobalHistory = true;
          } catch (ex) {
            // This can occur if the Places database is locked
            Cu.reportError("Error enabling browser global history: " + ex);
          }
        }
      }
    } catch (e) {
      Cu.reportError(e);
    }
    try {
      // Ensures the securityUI is initialized.
      var securityUI = this.securityUI; // eslint-disable-line no-unused-vars
    } catch (e) {}

    // tabbrowser.xml sets "sameProcessAsFrameLoader" as a direct property
    // on some browsers before they are put into a DOM (and get a
    // binding).  This hack makes sure that we hold a weak reference to
    // the other browser (and go through the proper getter and setter).
    if (this.hasOwnProperty("sameProcessAsFrameLoader")) {
      var sameProcessAsFrameLoader = this.sameProcessAsFrameLoader;
      delete this.sameProcessAsFrameLoader;
      this.sameProcessAsFrameLoader = sameProcessAsFrameLoader;
    }

    if (!this.isRemoteBrowser) {
      this.addEventListener("pagehide", this.onPageHide, true);
    }

    if (this.messageManager) {
      this.messageManager.addMessageListener("PopupBlocking:UpdateBlockedPopups", this);
      this.messageManager.addMessageListener("Autoscroll:Start", this);
      this.messageManager.addMessageListener("Autoscroll:Cancel", this);
      this.messageManager.addMessageListener("AudioPlayback:Start", this);
      this.messageManager.addMessageListener("AudioPlayback:Stop", this);
      this.messageManager.addMessageListener("AudioPlayback:ActiveMediaBlockStart", this);
      this.messageManager.addMessageListener("AudioPlayback:ActiveMediaBlockStop", this);
      this.messageManager.addMessageListener("UnselectedTabHover:Toggle", this);
      this.messageManager.addMessageListener("AudibleAutoplayMediaOccurred", this);

      if (this.hasAttribute("selectmenulist")) {
        this.messageManager.addMessageListener("Forms:ShowDropDown", this);
        this.messageManager.addMessageListener("Forms:HideDropDown", this);
      }

    }

    this._setupEventListeners();
  }

  get autoscrollEnabled() {
    if (this.getAttribute("autoscroll") == "false")
      return false;

    return this.mPrefs.getBoolPref("general.autoScroll", true);
  }

  get canGoBack() {
    return this.webNavigation.canGoBack;
  }

  get canGoForward() {
    return this.webNavigation.canGoForward;
  }

  get currentURI() {
    if (this.webNavigation) {
      return this.webNavigation.currentURI;
    }
    return null;
  }

  get documentURI() {
    return this.contentDocument.documentURIObject;
  }

  get documentContentType() {
    return this.contentDocument ? this.contentDocument.contentType : null;
  }

  set sameProcessAsFrameLoader(val) {
    this._sameProcessAsFrameLoader = Cu.getWeakReference(val);
  }

  get sameProcessAsFrameLoader() {
    return this._sameProcessAsFrameLoader && this._sameProcessAsFrameLoader.get();
  }

  get loadContext() {
    if (this._loadContext)
      return this._loadContext;

    let { frameLoader } = this;
    if (!frameLoader)
      return null;
    this._loadContext = frameLoader.loadContext;
    return this._loadContext;
  }

  get autoCompletePopup() {
    return document.getElementById(this.getAttribute('autocompletepopup'))
  }

  get dateTimePicker() {
    return document.getElementById(this.getAttribute('datetimepicker'))
  }

  set docShellIsActive(val) {
    if (this.docShell)
      return this.docShell.isActive = val;
    return false;
  }

  get docShellIsActive() {
    return this.docShell && this.docShell.isActive;
  }

  set renderLayers(val) {
    return this.docShellIsActive = val;
  }

  get renderLayers() {
    return this.docShellIsActive;
  }

  get hasLayers() {
    return this.docShellIsActive;
  }

  get imageDocument() {
    var document = this.contentDocument;
    if (!document || !(document instanceof Ci.nsIImageDocument))
      return null;

    try {
      return { width: document.imageRequest.image.width, height: document.imageRequest.image.height };
    } catch (e) {}
    return null;
  }

  get isRemoteBrowser() {
    return (this.getAttribute('remote') == 'true');
  }

  get remoteType() {
    if (!this.isRemoteBrowser) {
      return null;
    }

    let remoteType = this.getAttribute("remoteType");
    if (remoteType) {
      return remoteType;
    }

    let E10SUtils = ChromeUtils.import("resource://gre/modules/E10SUtils.jsm", {}).E10SUtils;
    return E10SUtils.DEFAULT_REMOTE_TYPE;
  }

  get messageManager() {
    if (this.frameLoader) {
      return this.frameLoader.messageManager;
    }
    return null;
  }

  get webBrowserFind() {
    if (!this._webBrowserFind)
      this._webBrowserFind = this.docShell.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebBrowserFind);
    return this._webBrowserFind;
  }

  get finder() {
    if (!this._finder) {
      if (!this.docShell)
        return null;

      let Finder = ChromeUtils.import("resource://gre/modules/Finder.jsm", {}).Finder;
      this._finder = new Finder(this.docShell);
    }
    return this._finder;
  }

  get fastFind() {
    if (!this._fastFind) {
      if (!("@mozilla.org/typeaheadfind;1" in Cc))
        return null;

      var tabBrowser = this.getTabBrowser();
      if (tabBrowser && "fastFind" in tabBrowser)
        return this._fastFind = tabBrowser.fastFind;

      if (!this.docShell)
        return null;

      this._fastFind = Cc["@mozilla.org/typeaheadfind;1"]
        .createInstance(Ci.nsITypeAheadFind);
      this._fastFind.init(this.docShell);
    }
    return this._fastFind;
  }

  get outerWindowID() {
    return this.contentWindow.windowUtils.outerWindowID;
  }

  get innerWindowID() {
    try {
      return this.contentWindow.windowUtils.currentInnerWindowID;
    } catch (e) {
      if (e.result != Cr.NS_ERROR_NOT_AVAILABLE) {
        throw e;
      }
      return null;
    }
  }

  get webProgress() {
    return this.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebProgress);
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

  get contentDocumentAsCPOW() {
    return this.contentDocument;
  }

  get contentTitle() {
    return this.contentDocument.title;
  }

  set characterSet(val) {
    this.docShell.charset = val;
    this.docShell.gatherCharsetMenuTelemetry();
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

  get contentRequestContextID() {
    try {
      return this.contentDocument.documentLoadGroup
        .requestContextID;
    } catch (e) {
      return null;
    }
  }

  set showWindowResizer(val) {
    if (val) this.setAttribute('showresizer', 'true');
    else this.removeAttribute('showresizer');
    return val;
  }

  get showWindowResizer() {
    return this.getAttribute('showresizer') == 'true';
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
    return this.contentDocument.mozSyntheticDocument;
  }

  get hasContentOpener() {
    return !!this.contentWindow.opener;
  }

  get mStrBundle() {
    if (!this._mStrBundle) {
      // need to create string bundle manually instead of using <xul:stringbundle/>
      // see bug 63370 for details
      this._mStrBundle = Cc["@mozilla.org/intl/stringbundle;1"]
        .getService(Ci.nsIStringBundleService)
        .createBundle("chrome://global/locale/browser.properties");
    }
    return this._mStrBundle;
  }

  get audioMuted() {
    return this._audioMuted;
  }

  get shouldHandleUnselectedTabHover() {
    return this._shouldSendUnselectedTabHover;
  }

  set securityUI(val) {
    this.docShell.securityUI = val;
  }

  get securityUI() {
    if (!this.docShell.securityUI) {
      const SECUREBROWSERUI_CONTRACTID = "@mozilla.org/secure_browser_ui;1";
      if (!this.hasAttribute("disablesecurity") &&
        SECUREBROWSERUI_CONTRACTID in Cc) {
        var securityUI = Cc[SECUREBROWSERUI_CONTRACTID]
          .createInstance(Ci.nsISecureBrowserUI);
        securityUI.init(this.contentWindow);
      }
    }

    return this.docShell.securityUI;
  }

  set userTypedValue(val) {
    this.urlbarChangeTracker.userTyped();
    this._userTypedValue = val;
    return val;
  }

  get userTypedValue() {
    return this._userTypedValue;
  }

  get dontPromptAndDontUnload() {
    return 1;
  }

  get dontPromptAndUnload() {
    return 2;
  }

  _wrapURIChangeCall(fn) {
    if (!this.isRemoteBrowser) {
      this.inLoadURI = true;
      try {
        fn();
      } finally {
        this.inLoadURI = false;
      }
    } else {
      fn();
    }
  }

  goBack() {
    var webNavigation = this.webNavigation;
    if (webNavigation.canGoBack)
      this._wrapURIChangeCall(() => webNavigation.goBack());
  }

  goForward() {
    var webNavigation = this.webNavigation;
    if (webNavigation.canGoForward)
      this._wrapURIChangeCall(() => webNavigation.goForward());
  }

  reload() {
    const nsIWebNavigation = Ci.nsIWebNavigation;
    const flags = nsIWebNavigation.LOAD_FLAGS_NONE;
    this.reloadWithFlags(flags);
  }

  reloadWithFlags(aFlags) {
    this.webNavigation.reload(aFlags);
  }

  stop() {
    const nsIWebNavigation = Ci.nsIWebNavigation;
    const flags = nsIWebNavigation.STOP_ALL;
    this.webNavigation.stop(flags);
  }

  /**
   * throws exception for unknown schemes
   */
  loadURI(aURI, aParams) {
    if (!aURI) {
      aURI = "about:blank";
    }

    let {
      flags = Ci.nsIWebNavigation.LOAD_FLAGS_NONE,
        referrerURI,
        referrerPolicy = Ci.nsIHttpChannel.REFERRER_POLICY_UNSET,
        triggeringPrincipal,
        postData,
    } = aParams || {};

    this._wrapURIChangeCall(() =>
      this.webNavigation.loadURIWithOptions(
        aURI, flags, referrerURI, referrerPolicy,
        postData, null, null, triggeringPrincipal));
  }

  gotoIndex(aIndex) {
    this._wrapURIChangeCall(() => this.webNavigation.gotoIndex(aIndex));
  }

  /**
   * Used by session restore to ensure that currentURI is set so
   * that switch-to-tab works before the tab is fully
   * restored. This function also invokes onLocationChanged
   * listeners in tabbrowser.xml.
   */
  _setCurrentURI(aURI) {
    this.docShell.setCurrentURI(aURI);
  }

  preserveLayers(preserve) {
    // Only useful for remote browsers.
  }

  getTabBrowser() {
    if (this.ownerGlobal.gBrowser &&
      this.ownerGlobal.gBrowser.getTabForBrowser &&
      this.ownerGlobal.gBrowser.getTabForBrowser(this)) {
      return this.ownerGlobal.gBrowser;
    }
    return null;
  }

  addProgressListener(aListener, aNotifyMask) {
    if (!aNotifyMask) {
      aNotifyMask = Ci.nsIWebProgress.NOTIFY_ALL;
    }
    this.webProgress.addProgressListener(aListener, aNotifyMask);
  }

  removeProgressListener(aListener) {
    this.webProgress.removeProgressListener(aListener);
  }

  onPageHide(aEvent) {
    // Delete the feeds cache if we're hiding the topmost page
    // (as opposed to one of its iframes).
    if (this.feeds && aEvent.target == this.contentDocument)
      this.feeds = null;
    if (!this.docShell || !this.fastFind)
      return;
    var tabBrowser = this.getTabBrowser();
    if (!tabBrowser || !("fastFind" in tabBrowser) ||
      tabBrowser.selectedBrowser == this)
      this.fastFind.setDocShell(this.docShell);
  }

  updateBlockedPopups() {
    let event = document.createEvent("Events");
    event.initEvent("DOMUpdateBlockedPopups", true, true);
    this.dispatchEvent(event);
  }

  retrieveListOfBlockedPopups() {
    this.messageManager.sendAsyncMessage("PopupBlocking:GetBlockedPopupList", null);
    return new Promise(resolve => {
      let self = this;
      this.messageManager.addMessageListener("PopupBlocking:ReplyGetBlockedPopupList",
        function replyReceived(msg) {
          self.messageManager.removeMessageListener("PopupBlocking:ReplyGetBlockedPopupList",
            replyReceived);
          resolve(msg.data.popupData);
        }
      );
    });
  }

  unblockPopup(aPopupIndex) {
    this.messageManager.sendAsyncMessage("PopupBlocking:UnblockPopup", { index: aPopupIndex });
  }

  audioPlaybackStarted() {
    if (this._audioMuted) {
      return;
    }
    let event = document.createEvent("Events");
    event.initEvent("DOMAudioPlaybackStarted", true, false);
    this.dispatchEvent(event);
  }

  audioPlaybackStopped() {
    let event = document.createEvent("Events");
    event.initEvent("DOMAudioPlaybackStopped", true, false);
    this.dispatchEvent(event);
  }

  notifyAudibleAutoplayMediaOccurred() {
    let event = document.createEvent("Events");
    event.initEvent("AudibleAutoplayMediaOccurred", true, false);
    this.dispatchEvent(event);
  }

  /**
   * When the pref "media.block-autoplay-until-in-foreground" is on,
   * Gecko delays starting playback of media resources in tabs until the
   * tab has been in the foreground or resumed by tab's play tab icon.
   * - When Gecko delays starting playback of a media resource in a window,
   * it sends a message to call activeMediaBlockStarted(). This causes the
   * tab audio indicator to show.
   * - When a tab is foregrounded, Gecko starts playing all delayed media
   * resources in that tab, and sends a message to call
   * activeMediaBlockStopped(). This causes the tab audio indicator to hide.
   */
  activeMediaBlockStarted() {
    this._hasAnyPlayingMediaBeenBlocked = true;
    let event = document.createEvent("Events");
    event.initEvent("DOMAudioPlaybackBlockStarted", true, false);
    this.dispatchEvent(event);
  }

  activeMediaBlockStopped() {
    if (!this._hasAnyPlayingMediaBeenBlocked) {
      return;
    }
    this._hasAnyPlayingMediaBeenBlocked = false;
    let event = document.createEvent("Events");
    event.initEvent("DOMAudioPlaybackBlockStopped", true, false);
    this.dispatchEvent(event);
  }

  mute(transientState) {
    if (!transientState) {
      this._audioMuted = true;
    }
    this.messageManager.sendAsyncMessage("AudioPlayback", { type: "mute" });
  }

  unmute() {
    this._audioMuted = false;
    this.messageManager.sendAsyncMessage("AudioPlayback", { type: "unmute" });
  }

  pauseMedia(disposable) {
    let suspendedReason;
    if (disposable) {
      suspendedReason = "mediaControlPaused";
    } else {
      suspendedReason = "lostAudioFocusTransiently";
    }

    this.messageManager.sendAsyncMessage("AudioPlayback", { type: suspendedReason });
  }

  stopMedia() {
    this.messageManager.sendAsyncMessage("AudioPlayback", { type: "mediaControlStopped" });
  }

  resumeMedia() {
    this.messageManager.sendAsyncMessage("AudioPlayback", { type: "resumeMedia" });
    if (this._hasAnyPlayingMediaBeenBlocked) {
      this._hasAnyPlayingMediaBeenBlocked = false;
      let event = document.createEvent("Events");
      event.initEvent("DOMAudioPlaybackBlockStopped", true, false);
      this.dispatchEvent(event);
    }
  }

  unselectedTabHover(hovered) {
    if (!this._shouldSendUnselectedTabHover) {
      return;
    }
    this.messageManager.sendAsyncMessage("Browser:UnselectedTabHover", { hovered });
  }

  didStartLoadSinceLastUserTyping() {
    return !this.inLoadURI &&
      this.urlbarChangeTracker._startedLoadSinceLastUserTyping;
  }

  /**
   * This is necessary because the destructor doesn't always get called when
   * we are removed from a tabbrowser. This will be explicitly called by tabbrowser.
   *
   * Note: this function is overriden in remote-browser.xml, so any clean-up that
   * also applies to browser.isRemoteBrowser = true must be duplicated there.
   */
  destroy() {
    // Make sure that any open select is closed.
    if (this._selectParentHelper) {
      let menulist = document.getElementById(this.getAttribute("selectmenulist"));
      this._selectParentHelper.hide(menulist, this);
    }
    if (this.mDestroyed)
      return;
    this.mDestroyed = true;

    if (this.docShell && this.webNavigation.sessionHistory) {
      var os = Cc["@mozilla.org/observer-service;1"]
        .getService(Ci.nsIObserverService);
      try {
        os.removeObserver(this, "browser:purge-session-history");
      } catch (ex) {
        // It's not clear why this sometimes throws an exception.
      }
    }

    this._fastFind = null;
    this._webBrowserFind = null;

    // The feeds cache can keep the document inside this browser alive.
    this.feeds = null;

    this.lastURI = null;

    if (!this.isRemoteBrowser) {
      this.removeEventListener("pagehide", this.onPageHide, true);
    }

    if (this._autoScrollNeedsCleanup) {
      // we polluted the global scope, so clean it up
      this._autoScrollPopup.remove();
    }
  }

  /**
   * We call this _receiveMessage (and alias receiveMessage to it) so that
   * bindings that inherit from this one can delegate to it.
   */
  _receiveMessage(aMessage) {
    let data = aMessage.data;
    switch (aMessage.name) {
      case "PopupBlocking:UpdateBlockedPopups":
        {
          this.blockedPopups = {
            length: data.count,
            reported: !data.freshPopup,
          };

          this.updateBlockedPopups();
          break;
        }
      case "Autoscroll:Start":
        {
          if (!this.autoscrollEnabled) {
            return { autoscrollEnabled: false, usingApz: false };
          }
          this.startScroll(data.scrolldir, data.screenX, data.screenY);
          let usingApz = false;
          if (this.isRemoteBrowser && data.scrollId != null &&
            this.mPrefs.getBoolPref("apz.autoscroll.enabled", false)) {
            let { tabParent } = this.frameLoader;
            if (tabParent) {
              // If APZ is handling the autoscroll, it may decide to cancel
              // it of its own accord, so register an observer to allow it
              // to notify us of that.
              var os = Cc["@mozilla.org/observer-service;1"]
                .getService(Ci.nsIObserverService);
              os.addObserver(this, "apz:cancel-autoscroll", true);

              usingApz = tabParent.startApzAutoscroll(
                data.screenX, data.screenY,
                data.scrollId, data.presShellId);
            }
            // Save the IDs for later
            this._autoScrollScrollId = data.scrollId;
            this._autoScrollPresShellId = data.presShellId;
          }
          return { autoscrollEnabled: true, usingApz };
        }
      case "Autoscroll:Cancel":
        this._autoScrollPopup.hidePopup();
        break;
      case "AudioPlayback:Start":
        this.audioPlaybackStarted();
        break;
      case "AudioPlayback:Stop":
        this.audioPlaybackStopped();
        break;
      case "AudioPlayback:ActiveMediaBlockStart":
        this.activeMediaBlockStarted();
        break;
      case "AudioPlayback:ActiveMediaBlockStop":
        this.activeMediaBlockStopped();
        break;
      case "UnselectedTabHover:Toggle":
        this._shouldSendUnselectedTabHover = data.enable ?
          ++this._unselectedTabHoverMessageListenerCount > 0 :
          --this._unselectedTabHoverMessageListenerCount == 0;
        break;
      case "AudibleAutoplayMediaOccurred":
        this.notifyAudibleAutoplayMediaOccurred();
        break;
      case "Forms:ShowDropDown":
        {
          if (!this._selectParentHelper) {
            this._selectParentHelper =
              ChromeUtils.import("resource://gre/modules/SelectParentHelper.jsm", {}).SelectParentHelper;
          }

          let menulist = document.getElementById(this.getAttribute("selectmenulist"));
          menulist.menupopup.style.direction = data.direction;
          this._selectParentHelper.populate(menulist, data.options, data.selectedIndex, this._fullZoom,
            data.uaBackgroundColor, data.uaColor,
            data.uaSelectBackgroundColor, data.uaSelectColor,
            data.selectBackgroundColor, data.selectColor, data.selectTextShadow);
          this._selectParentHelper.open(this, menulist, data.rect, data.isOpenedViaTouch);
          break;
        }

      case "Forms:HideDropDown":
        {
          if (this._selectParentHelper) {
            let menulist = document.getElementById(this.getAttribute("selectmenulist"));
            this._selectParentHelper.hide(menulist, this);
          }
          break;
        }

    }
    return undefined;
  }

  receiveMessage(aMessage) {
    return this._receiveMessage(aMessage);
  }

  observe(aSubject, aTopic, aState) {
    if (aTopic == "browser:purge-session-history") {
      this.purgeSessionHistory();
    } else if (aTopic == "apz:cancel-autoscroll") {
      if (aState == this._autoScrollScrollId) {
        // Set this._autoScrollScrollId to null, so in stopScroll() we
        // don't call stopApzAutoscroll() (since it's APZ that
        // initiated the stopping).
        this._autoScrollScrollId = null;
        this._autoScrollPresShellId = null;

        this._autoScrollPopup.hidePopup();
      }
    }
  }

  purgeSessionHistory() {
    this.messageManager.sendAsyncMessage("Browser:PurgeSessionHistory");
  }

  createAboutBlankContentViewer(aPrincipal) {
    let principal = BrowserUtils.principalWithMatchingOA(aPrincipal, this.contentPrincipal);
    this.docShell.createAboutBlankContentViewer(principal);
  }

  stopScroll() {
    if (this._scrolling) {
      this._scrolling = false;
      window.removeEventListener("mousemove", this, true);
      window.removeEventListener("mousedown", this, true);
      window.removeEventListener("mouseup", this, true);
      window.removeEventListener("DOMMouseScroll", this, true);
      window.removeEventListener("contextmenu", this, true);
      window.removeEventListener("keydown", this, true);
      window.removeEventListener("keypress", this, true);
      window.removeEventListener("keyup", this, true);
      this.messageManager.sendAsyncMessage("Autoscroll:Stop");

      var os = Cc["@mozilla.org/observer-service;1"]
        .getService(Ci.nsIObserverService);
      try {
        os.removeObserver(this, "apz:cancel-autoscroll");
      } catch (ex) {
        // It's not clear why this sometimes throws an exception
      }

      if (this.isRemoteBrowser && this._autoScrollScrollId != null) {
        let { tabParent } = this.frameLoader;
        if (tabParent) {
          tabParent.stopApzAutoscroll(this._autoScrollScrollId,
            this._autoScrollPresShellId);
        }
        this._autoScrollScrollId = null;
        this._autoScrollPresShellId = null;
      }
    }
  }

  _createAutoScrollPopup() {
    var popup = document.createXULElement("panel");
    popup.className = "autoscroller";
    // We set this attribute on the element so that mousemove
    // events can be handled by browser-content.js.
    popup.setAttribute("mousethrough", "always");
    popup.setAttribute("consumeoutsideclicks", "true");
    popup.setAttribute("rolluponmousewheel", "true");
    popup.setAttribute("hidden", "true");
    return popup;
  }

  startScroll(scrolldir, screenX, screenY) {
    const POPUP_SIZE = 32;
    if (!this._autoScrollPopup) {
      if (this.hasAttribute("autoscrollpopup")) {
        // our creator provided a popup to share
        this._autoScrollPopup = document.getElementById(this.getAttribute("autoscrollpopup"));
      } else {
        // we weren't provided a popup; we have to use the global scope
        this._autoScrollPopup = this._createAutoScrollPopup();
        document.documentElement.appendChild(this._autoScrollPopup);
        this._autoScrollNeedsCleanup = true;
      }
      this._autoScrollPopup.removeAttribute("hidden");
      this._autoScrollPopup.setAttribute("noautofocus", "true");
      this._autoScrollPopup.style.height = POPUP_SIZE + "px";
      this._autoScrollPopup.style.width = POPUP_SIZE + "px";
      this._autoScrollPopup.style.margin = -POPUP_SIZE / 2 + "px";
    }

    let screenManager = Cc["@mozilla.org/gfx/screenmanager;1"]
      .getService(Ci.nsIScreenManager);
    let screen = screenManager.screenForRect(screenX, screenY, 1, 1);

    // we need these attributes so themers don't need to create per-platform packages
    if (screen.colorDepth > 8) { // need high color for transparency
      // Exclude second-rate platforms
      this._autoScrollPopup.setAttribute("transparent", !/BeOS|OS\/2/.test(navigator.appVersion));
      // Enable translucency on Windows and Mac
      this._autoScrollPopup.setAttribute("translucent", /Win|Mac/.test(navigator.platform));
    }

    this._autoScrollPopup.setAttribute("scrolldir", scrolldir);
    this._autoScrollPopup.addEventListener("popuphidden", this, true);

    // Sanitize screenX/screenY for available screen size with half the size
    // of the popup removed. The popup uses negative margins to center on the
    // coordinates we pass. Unfortunately `window.screen.availLeft` can be negative
    // on Windows in multi-monitor setups, so we use nsIScreenManager instead:
    let left = {},
      top = {},
      width = {},
      height = {};
    screen.GetAvailRect(left, top, width, height);

    // We need to get screen CSS-pixel (rather than display-pixel) coordinates.
    // With 175% DPI, the actual ratio of display pixels to CSS pixels is
    // 1.7647 because of rounding inside gecko. Unfortunately defaultCSSScaleFactor
    // returns the original 1.75 dpi factor. While window.devicePixelRatio would
    // get us the correct ratio, if the window is split between 2 screens,
    // window.devicePixelRatio isn't guaranteed to match the screen we're
    // autoscrolling on. So instead we do the same math as Gecko.
    const scaleFactor = 60 / Math.round(60 / screen.defaultCSSScaleFactor);
    let minX = left.value / scaleFactor + 0.5 * POPUP_SIZE;
    let maxX = (left.value + width.value) / scaleFactor - 0.5 * POPUP_SIZE;
    let minY = top.value / scaleFactor + 0.5 * POPUP_SIZE;
    let maxY = (top.value + height.value) / scaleFactor - 0.5 * POPUP_SIZE;
    let popupX = Math.max(minX, Math.min(maxX, screenX));
    let popupY = Math.max(minY, Math.min(maxY, screenY));
    this._autoScrollPopup.openPopupAtScreen(popupX, popupY);
    this._ignoreMouseEvents = true;
    this._scrolling = true;
    this._startX = screenX;
    this._startY = screenY;

    window.addEventListener("mousemove", this, true);
    window.addEventListener("mousedown", this, true);
    window.addEventListener("mouseup", this, true);
    window.addEventListener("DOMMouseScroll", this, true);
    window.addEventListener("contextmenu", this, true);
    window.addEventListener("keydown", this, true);
    window.addEventListener("keypress", this, true);
    window.addEventListener("keyup", this, true);
  }

  handleEvent(aEvent) {
    if (this._scrolling) {
      switch (aEvent.type) {
        case "mousemove":
          {
            var x = aEvent.screenX - this._startX;
            var y = aEvent.screenY - this._startY;

            if ((x > this._AUTOSCROLL_SNAP || x < -this._AUTOSCROLL_SNAP) ||
              (y > this._AUTOSCROLL_SNAP || y < -this._AUTOSCROLL_SNAP))
              this._ignoreMouseEvents = false;
            break;
          }
        case "mouseup":
        case "mousedown":
        case "contextmenu":
          {
            if (!this._ignoreMouseEvents) {
              // Use a timeout to prevent the mousedown from opening the popup again.
              // Ideally, we could use preventDefault here, but contenteditable
              // and middlemouse paste don't interact well. See bug 1188536.
              setTimeout(() => this._autoScrollPopup.hidePopup(), 0);
            }
            this._ignoreMouseEvents = false;
            break;
          }
        case "DOMMouseScroll":
          {
            this._autoScrollPopup.hidePopup();
            aEvent.preventDefault();
            break;
          }
        case "popuphidden":
          {
            this._autoScrollPopup.removeEventListener("popuphidden", this, true);
            this.stopScroll();
            break;
          }
        case "keydown":
          {
            if (aEvent.keyCode == aEvent.DOM_VK_ESCAPE) {
              // the escape key will be processed by
              // nsXULPopupManager::KeyDown and the panel will be closed.
              // So, don't consume the key event here.
              break;
            }
            // don't break here. we need to eat keydown events.
          }
        case "keypress":
        case "keyup":
          {
            // All keyevents should be eaten here during autoscrolling.
            aEvent.stopPropagation();
            aEvent.preventDefault();
            break;
          }
      }
    }
  }

  closeBrowser() {
    // The request comes from a XPCOM component, we'd want to redirect
    // the request to tabbrowser.
    let tabbrowser = this.getTabBrowser();
    if (tabbrowser) {
      let tab = tabbrowser.getTabForBrowser(this);
      if (tab) {
        tabbrowser.removeTab(tab);
        return;
      }
    }

    throw new Error("Closing a browser which was not attached to a tabbrowser is unsupported.");
  }

  swapBrowsers(aOtherBrowser, aFlags) {
    // The request comes from a XPCOM component, we'd want to redirect
    // the request to tabbrowser so tabbrowser will be setup correctly,
    // and it will eventually call swapDocShells.
    let ourTabBrowser = this.getTabBrowser();
    let otherTabBrowser = aOtherBrowser.getTabBrowser();
    if (ourTabBrowser && otherTabBrowser) {
      let ourTab = ourTabBrowser.getTabForBrowser(this);
      let otherTab = otherTabBrowser.getTabForBrowser(aOtherBrowser);
      ourTabBrowser.swapBrowsers(ourTab, otherTab, aFlags);
      return;
    }

    // One of us is not connected to a tabbrowser, so just swap.
    this.swapDocShells(aOtherBrowser);
  }

  swapDocShells(aOtherBrowser) {
    if (this.isRemoteBrowser != aOtherBrowser.isRemoteBrowser)
      throw new Error("Can only swap docshells between browsers in the same process.");

    // Give others a chance to swap state.
    // IMPORTANT: Since a swapDocShells call does not swap the messageManager
    //            instances attached to a browser to aOtherBrowser, others
    //            will need to add the message listeners to the new
    //            messageManager.
    //            This is not a bug in swapDocShells or the FrameLoader,
    //            merely a design decision: If message managers were swapped,
    //            so that no new listeners were needed, the new
    //            aOtherBrowser.messageManager would have listeners pointing
    //            to the JS global of the current browser, which would rather
    //            easily create leaks while swapping.
    // IMPORTANT2: When the current browser element is removed from DOM,
    //             which is quite common after a swpDocShells call, its
    //             frame loader is destroyed, and that destroys the relevant
    //             message manager, which will remove the listeners.
    let event = new CustomEvent("SwapDocShells", { "detail": aOtherBrowser });
    this.dispatchEvent(event);
    event = new CustomEvent("SwapDocShells", { "detail": this });
    aOtherBrowser.dispatchEvent(event);

    // We need to swap fields that are tied to our docshell or related to
    // the loaded page
    // Fields which are built as a result of notifactions (pageshow/hide,
    // DOMLinkAdded/Removed, onStateChange) should not be swapped here,
    // because these notifications are dispatched again once the docshells
    // are swapped.
    var fieldsToSwap = [
      "_webBrowserFind",
    ];

    if (this.isRemoteBrowser) {
      fieldsToSwap.push(...[
        "_remoteWebNavigation",
        "_remoteWebNavigationImpl",
        "_remoteWebProgressManager",
        "_remoteWebProgress",
        "_remoteFinder",
        "_securityUI",
        "_documentURI",
        "_documentContentType",
        "_contentTitle",
        "_characterSet",
        "_mayEnableCharacterEncodingMenu",
        "_contentPrincipal",
        "_imageDocument",
        "_fullZoom",
        "_textZoom",
        "_isSyntheticDocument",
        "_innerWindowID",
      ]);
    }

    var ourFieldValues = {};
    var otherFieldValues = {};
    for (let field of fieldsToSwap) {
      ourFieldValues[field] = this[field];
      otherFieldValues[field] = aOtherBrowser[field];
    }

    if (window.PopupNotifications)
      PopupNotifications._swapBrowserNotifications(aOtherBrowser, this);

    try {
      this.swapFrameLoaders(aOtherBrowser);
    } catch (ex) {
      // This may not be implemented for browser elements that are not
      // attached to a BrowserDOMWindow.
    }

    for (let field of fieldsToSwap) {
      this[field] = otherFieldValues[field];
      aOtherBrowser[field] = ourFieldValues[field];
    }

    if (!this.isRemoteBrowser) {
      // Null the current nsITypeAheadFind instances so that they're
      // lazily re-created on access. We need to do this because they
      // might have attached the wrong docShell.
      this._fastFind = aOtherBrowser._fastFind = null;
    } else {
      // Rewire the remote listeners
      this._remoteWebNavigationImpl.swapBrowser(this);
      aOtherBrowser._remoteWebNavigationImpl.swapBrowser(aOtherBrowser);

      if (this._remoteWebProgressManager && aOtherBrowser._remoteWebProgressManager) {
        this._remoteWebProgressManager.swapBrowser(this);
        aOtherBrowser._remoteWebProgressManager.swapBrowser(aOtherBrowser);
      }

      if (this._remoteFinder)
        this._remoteFinder.swapBrowser(this);
      if (aOtherBrowser._remoteFinder)
        aOtherBrowser._remoteFinder.swapBrowser(aOtherBrowser);
    }

    event = new CustomEvent("EndSwapDocShells", { "detail": aOtherBrowser });
    this.dispatchEvent(event);
    event = new CustomEvent("EndSwapDocShells", { "detail": this });
    aOtherBrowser.dispatchEvent(event);
  }

  getInPermitUnload(aCallback) {
    if (!this.docShell || !this.docShell.contentViewer) {
      aCallback(false);
      return;
    }
    aCallback(this.docShell.contentViewer.inPermitUnload);
  }

  permitUnload(aPermitUnloadFlags) {
    if (!this.docShell || !this.docShell.contentViewer) {
      return { permitUnload: true, timedOut: false };
    }
    return {
      permitUnload: this.docShell.contentViewer.permitUnload(aPermitUnloadFlags),
      timedOut: false
    };
  }

  print(aOuterWindowID, aPrintSettings, aPrintProgressListener) {
    if (!this.frameLoader) {
      throw Components.Exception("No frame loader.",
        Cr.NS_ERROR_FAILURE);
    }

    this.frameLoader.print(aOuterWindowID, aPrintSettings,
      aPrintProgressListener);
  }

  dropLinks(aLinksCount, aLinks, aTriggeringPrincipal) {
    if (!this.droppedLinkHandler) {
      return false;
    }
    let links = [];
    for (let i = 0; i < aLinksCount; i += 3) {
      links.push({
        url: aLinks[i],
        name: aLinks[i + 1],
        type: aLinks[i + 2],
      });
    }
    this.droppedLinkHandler(null, links, aTriggeringPrincipal);
    return true;
  }

  disconnectedCallback() {
    this.destroy();
  }

  _setupEventListeners() {
    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_F7) { return; }
      if (event.defaultPrevented || !event.isTrusted)
        return;

      const kPrefShortcutEnabled = "accessibility.browsewithcaret_shortcut.enabled";
      const kPrefWarnOnEnable = "accessibility.warn_on_browsewithcaret";
      const kPrefCaretBrowsingOn = "accessibility.browsewithcaret";

      var isEnabled = this.mPrefs.getBoolPref(kPrefShortcutEnabled);
      if (!isEnabled)
        return;

      // Toggle browse with caret mode
      var browseWithCaretOn = this.mPrefs.getBoolPref(kPrefCaretBrowsingOn, false);
      var warn = this.mPrefs.getBoolPref(kPrefWarnOnEnable, true);
      if (warn && !browseWithCaretOn) {
        var checkValue = { value: false };
        var promptService = Cc["@mozilla.org/embedcomp/prompt-service;1"]
          .getService(Ci.nsIPromptService);

        var buttonPressed = promptService.confirmEx(window,
          this.mStrBundle.GetStringFromName("browsewithcaret.checkWindowTitle"),
          this.mStrBundle.GetStringFromName("browsewithcaret.checkLabel"),
          // Make "No" the default:
          promptService.STD_YES_NO_BUTTONS | promptService.BUTTON_POS_1_DEFAULT,
          null, null, null, this.mStrBundle.GetStringFromName("browsewithcaret.checkMsg"),
          checkValue);
        if (buttonPressed != 0) {
          if (checkValue.value) {
            try {
              this.mPrefs.setBoolPref(kPrefShortcutEnabled, false);
            } catch (ex) {}
          }
          return;
        }
        if (checkValue.value) {
          try {
            this.mPrefs.setBoolPref(kPrefWarnOnEnable, false);
          } catch (ex) {}
        }
      }

      // Toggle the pref
      try {
        this.mPrefs.setBoolPref(kPrefCaretBrowsingOn, !browseWithCaretOn);
      } catch (ex) {}
    }, { mozSystemGroup: true });

    this.addEventListener("dragover", (event) => {
      if (!this.droppedLinkHandler || event.defaultPrevented)
        return;

      // For drags that appear to be internal text (for example, tab drags),
      // set the dropEffect to 'none'. This prevents the drop even if some
      // other listener cancelled the event.
      var types = event.dataTransfer.types;
      if (types.includes("text/x-moz-text-internal") && !types.includes("text/plain")) {
        event.dataTransfer.dropEffect = "none";
        event.stopPropagation();
        event.preventDefault();
      }

      // No need to handle "dragover" in e10s, since nsDocShellTreeOwner.cpp in the child process
      // handles that case using "@mozilla.org/content/dropped-link-handler;1" service.
      if (this.isRemoteBrowser)
        return;

      let linkHandler = Cc["@mozilla.org/content/dropped-link-handler;1"].
      getService(Ci.nsIDroppedLinkHandler);
      if (linkHandler.canDropLink(event, false))
        event.preventDefault();
    }, { mozSystemGroup: true });

    this.addEventListener("drop", (event) => {
      // No need to handle "drop" in e10s, since nsDocShellTreeOwner.cpp in the child process
      // handles that case using "@mozilla.org/content/dropped-link-handler;1" service.
      if (!this.droppedLinkHandler || event.defaultPrevented || this.isRemoteBrowser)
        return;

      let linkHandler = Cc["@mozilla.org/content/dropped-link-handler;1"].
      getService(Ci.nsIDroppedLinkHandler);
      try {
        // Pass true to prevent the dropping of javascript:/data: URIs
        var links = linkHandler.dropLinks(event, true);
      } catch (ex) {
        return;
      }

      if (links.length) {
        let triggeringPrincipal = linkHandler.getTriggeringPrincipal(event);
        this.droppedLinkHandler(event, links, triggeringPrincipal);
      }
    }, { mozSystemGroup: true });

  }
}

customElements.define("browser", MozBrowser);

}
