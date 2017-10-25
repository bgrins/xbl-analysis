class FirefoxTabbrowserTab extends FirefoxTab {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:stack class="tab-stack" flex="1">
<xul:vbox inherits="selected=visuallyselected,fadein" class="tab-background">
<xul:hbox inherits="selected=visuallyselected" class="tab-line">
</xul:hbox>
<xul:spacer flex="1">
</xul:spacer>
<xul:hbox class="tab-bottom-line">
</xul:hbox>
</xul:vbox>
<xul:hbox inherits="pinned,bursting,notselectedsinceload" anonid="tab-loading-burst" class="tab-loading-burst">
</xul:hbox>
<xul:hbox inherits="pinned,selected=visuallyselected,titlechanged,attention" class="tab-content" align="center">
<xul:hbox inherits="fadein,pinned,busy,progress,selected=visuallyselected" anonid="tab-throbber" class="tab-throbber" layer="true">
</xul:hbox>
<xul:image inherits="src=image,triggeringprincipal=iconloadingprincipal,requestcontextid,fadein,pinned,selected=visuallyselected,busy,crashed,sharing" anonid="tab-icon-image" class="tab-icon-image" validate="never" role="presentation">
</xul:image>
<xul:image inherits="sharing,selected=visuallyselected,pinned" anonid="sharing-icon" class="tab-sharing-icon-overlay" role="presentation">
</xul:image>
<xul:image inherits="crashed,busy,soundplaying,soundplaying-scheduledremoval,pinned,muted,blocked,selected=visuallyselected,activemedia-blocked" anonid="overlay-icon" class="tab-icon-overlay" role="presentation">
</xul:image>
<xul:hbox class="tab-label-container" inherits="pinned,selected=visuallyselected,labeldirection" onoverflow="this.setAttribute('textoverflow', 'true');" onunderflow="this.removeAttribute('textoverflow');" flex="1">
<xul:label class="tab-text tab-label" inherits="text=label,accesskey,fadein,pinned,selected=visuallyselected,attention" role="presentation">
</xul:label>
</xul:hbox>
<xul:image inherits="soundplaying,soundplaying-scheduledremoval,pinned,muted,blocked,selected=visuallyselected,activemedia-blocked" anonid="soundplaying-icon" class="tab-icon-sound" role="presentation">
</xul:image>
<xul:toolbarbutton anonid="close-button" inherits="fadein,pinned,selected=visuallyselected" class="tab-close-button close-icon">
</xul:toolbarbutton>
</xul:hbox>
</xul:stack>`;
    Object.defineProperty(this, "muteReason", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.muteReason;
        return (this.muteReason = undefined);
      },
      set(val) {
        delete this.muteReason;
        return (this.muteReason = val);
      }
    });
    Object.defineProperty(this, "mOverCloseButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mOverCloseButton;
        return (this.mOverCloseButton = false);
      },
      set(val) {
        delete this.mOverCloseButton;
        return (this.mOverCloseButton = val);
      }
    });
    Object.defineProperty(this, "mCorrespondingMenuitem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mCorrespondingMenuitem;
        return (this.mCorrespondingMenuitem = null);
      },
      set(val) {
        delete this.mCorrespondingMenuitem;
        return (this.mCorrespondingMenuitem = val);
      }
    });

    if (!("_lastAccessed" in this)) {
      this.updateLastAccessed();
    }

    this.addEventListener("mouseover", event => {
      let anonid = event.originalTarget.getAttribute("anonid");
      if (anonid == "close-button") this.mOverCloseButton = true;

      this._mouseenter();
    });

    this.addEventListener("mouseout", event => {
      let anonid = event.originalTarget.getAttribute("anonid");
      if (anonid == "close-button") this.mOverCloseButton = false;

      this._mouseleave();
    });

    this.addEventListener(
      "dragstart",
      event => {
        this.style.MozUserFocus = "";
      },
      true
    );

    this.addEventListener(
      "mousedown",
      event => {
        if (this.selected) {
          this.style.MozUserFocus = "ignore";
        } else if (this.mOverCloseButton || this._overPlayingIcon) {
          // Prevent tabbox.xml from selecting the tab.
          event.stopPropagation();
        }
      },
      true
    );

    this.addEventListener("mouseup", event => {
      this.style.MozUserFocus = "";
    });

    this.addEventListener("click", event => {
      if (event.button != 0) {
        return;
      }

      if (this._overPlayingIcon) {
        this.toggleMuteAudio();
      }
    });

    this.addEventListener("animationend", event => {
      let anonid = event.originalTarget.getAttribute("anonid");
      if (anonid == "tab-loading-burst") {
        this.removeAttribute("bursting");
      }
    });
  }

  set _visuallySelected(val) {
    if (val) this.setAttribute("visuallyselected", "true");
    else this.removeAttribute("visuallyselected");
    this.parentNode.tabbrowser._tabAttrModified(this, ["visuallyselected"]);

    this._setPositionAttributes(val);

    return val;
  }

  set _selected(val) {
    // in e10s we want to only pseudo-select a tab before its rendering is done, so that
    // the rest of the system knows that the tab is selected, but we don't want to update its
    // visual status to selected until after we receive confirmation that its content has painted.
    if (val) this.setAttribute("selected", "true");
    else this.removeAttribute("selected");

    // If we're non-e10s we should update the visual selection as well at the same time,
    // *or* if we're e10s and the visually selected tab isn't changing, in which case the
    // tab switcher code won't run and update anything else (like the before- and after-
    // selected attributes).
    if (
      !gMultiProcessBrowser ||
      (val && this.hasAttribute("visuallyselected"))
    ) {
      this._visuallySelected = val;
    }

    return val;
  }

  get pinned() {
    return this.getAttribute("pinned") == "true";
  }

  get hidden() {
    return this.getAttribute("hidden") == "true";
  }

  get muted() {
    return this.getAttribute("muted") == "true";
  }

  get userContextId() {
    return this.hasAttribute("usercontextid")
      ? parseInt(this.getAttribute("usercontextid"))
      : 0;
  }

  get soundPlaying() {
    return this.getAttribute("soundplaying") == "true";
  }

  get activeMediaBlocked() {
    return this.getAttribute("activemedia-blocked") == "true";
  }

  get lastAccessed() {
    return this._lastAccessed == Infinity ? Date.now() : this._lastAccessed;
  }

  get _overPlayingIcon() {
    let iconVisible =
      this.hasAttribute("soundplaying") ||
      this.hasAttribute("muted") ||
      this.hasAttribute("activemedia-blocked");
    let soundPlayingIcon = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "soundplaying-icon"
    );
    let overlayIcon = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "overlay-icon"
    );

    return (
      (soundPlayingIcon && soundPlayingIcon.matches(":hover")) ||
      (overlayIcon && overlayIcon.matches(":hover") && iconVisible)
    );
  }
  updateLastAccessed(aDate) {
    this._lastAccessed = this.selected ? Infinity : aDate || Date.now();
  }
  _mouseenter() {
    if (this.hidden || this.closing) return;

    let tabContainer = this.parentNode;
    let visibleTabs = tabContainer.tabbrowser.visibleTabs;
    let tabIndex = visibleTabs.indexOf(this);

    if (this.selected) tabContainer._handleTabSelect();

    if (tabIndex == 0) {
      tabContainer._beforeHoveredTab = null;
    } else {
      let candidate = visibleTabs[tabIndex - 1];
      if (!candidate.selected) {
        tabContainer._beforeHoveredTab = candidate;
        candidate.setAttribute("beforehovered", "true");
      }
    }

    if (tabIndex == visibleTabs.length - 1) {
      tabContainer._afterHoveredTab = null;
    } else {
      let candidate = visibleTabs[tabIndex + 1];
      if (!candidate.selected) {
        tabContainer._afterHoveredTab = candidate;
        candidate.setAttribute("afterhovered", "true");
      }
    }

    tabContainer._hoveredTab = this;
    if (this.linkedPanel && !this.selected) {
      this.linkedBrowser.unselectedTabHover(true);
      this.startUnselectedTabHoverTimer();
    }

    // Prepare connection to host beforehand.
    SessionStore.speculativeConnectOnTabHover(this);
    tabContainer.tabbrowser.warmupTab(this);
  }
  _mouseleave() {
    let tabContainer = this.parentNode;
    if (tabContainer._beforeHoveredTab) {
      tabContainer._beforeHoveredTab.removeAttribute("beforehovered");
      tabContainer._beforeHoveredTab = null;
    }
    if (tabContainer._afterHoveredTab) {
      tabContainer._afterHoveredTab.removeAttribute("afterhovered");
      tabContainer._afterHoveredTab = null;
    }

    tabContainer._hoveredTab = null;
    if (this.linkedPanel && !this.selected) {
      this.linkedBrowser.unselectedTabHover(false);
      this.cancelUnselectedTabHoverTimer();
    }
  }
  startUnselectedTabHoverTimer() {
    // Only record data when we need to.
    if (!this.linkedBrowser.shouldHandleUnselectedTabHover) {
      return;
    }

    if (
      !TelemetryStopwatch.running("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this)
    ) {
      TelemetryStopwatch.start("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this);
    }

    if (this._hoverTabTimer) {
      clearTimeout(this._hoverTabTimer);
      this._hoverTabTimer = null;
    }
  }
  cancelUnselectedTabHoverTimer() {
    // Since we're listening "mouseout" event, instead of "mouseleave".
    // Every time the cursor is moving from the tab to its child node (icon),
    // it would dispatch "mouseout"(for tab) first and then dispatch
    // "mouseover" (for icon, eg: close button, speaker icon) soon.
    // It causes we would cancel present TelemetryStopwatch immediately
    // when cursor is moving on the icon, and then start a new one.
    // In order to avoid this situation, we could delay cancellation and
    // remove it if we get "mouseover" within very short period.
    this._hoverTabTimer = setTimeout(() => {
      if (
        TelemetryStopwatch.running("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this)
      ) {
        TelemetryStopwatch.cancel("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this);
      }
    }, 100);
  }
  finishUnselectedTabHoverTimer() {
    // Stop timer when the tab is opened.
    if (TelemetryStopwatch.running("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this)) {
      TelemetryStopwatch.finish("HOVER_UNTIL_UNSELECTED_TAB_OPENED", this);
    }
  }
  startMediaBlockTimer() {
    TelemetryStopwatch.start("TAB_MEDIA_BLOCKING_TIME_MS", this);
  }
  finishMediaBlockTimer() {
    TelemetryStopwatch.finish("TAB_MEDIA_BLOCKING_TIME_MS", this);
  }
  toggleMuteAudio(aMuteReason) {
    // Do not attempt to toggle mute state if browser is lazy.
    if (!this.linkedPanel) {
      return;
    }

    let tabContainer = this.parentNode;
    let browser = this.linkedBrowser;
    let modifiedAttrs = [];
    let hist = Services.telemetry.getHistogramById("TAB_AUDIO_INDICATOR_USED");

    if (this.hasAttribute("activemedia-blocked")) {
      this.removeAttribute("activemedia-blocked");
      modifiedAttrs.push("activemedia-blocked");

      browser.resumeMedia();
      hist.add(3 /* unblockByClickingIcon */);
      this.finishMediaBlockTimer();
    } else {
      if (browser.audioMuted) {
        browser.unmute();
        this.removeAttribute("muted");
        BrowserUITelemetry.countTabMutingEvent("unmute", aMuteReason);
        hist.add(1 /* unmute */);
      } else {
        browser.mute();
        this.setAttribute("muted", "true");
        BrowserUITelemetry.countTabMutingEvent("mute", aMuteReason);
        hist.add(0 /* mute */);
      }
      this.muteReason = aMuteReason || null;
      modifiedAttrs.push("muted");
    }
    tabContainer.tabbrowser._tabAttrModified(this, modifiedAttrs);
  }
  setUserContextId(aUserContextId) {
    if (aUserContextId) {
      if (this.linkedBrowser) {
        this.linkedBrowser.setAttribute("usercontextid", aUserContextId);
      }
      this.setAttribute("usercontextid", aUserContextId);
    } else {
      if (this.linkedBrowser) {
        this.linkedBrowser.removeAttribute("usercontextid");
      }
      this.removeAttribute("usercontextid");
    }

    ContextualIdentityService.setTabStyle(this);
  }
}
customElements.define("firefox-tabbrowser-tab", FirefoxTabbrowserTab);
