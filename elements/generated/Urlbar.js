class FirefoxUrlbar extends FirefoxAutocomplete {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox anonid="textbox-container" class="autocomplete-textbox-container urlbar-textbox-container" flex="1" inherits="focused">
<children includes="image|deck|stack|box">
</children>
<xul:hbox anonid="textbox-input-box" class="textbox-input-box urlbar-input-box" flex="1" inherits="tooltiptext=inputtooltiptext">
<children>
</children>
<html:input anonid="input" class="autocomplete-textbox urlbar-input textbox-input" allowevents="true" inputmode="mozAwesomebar" inherits="tooltiptext=inputtooltiptext,value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,focused,textoverflow">
</html:input>
</xul:hbox>
<xul:image anonid="urlbar-go-button" class="urlbar-go-button urlbar-icon" onclick="gURLBar.handleCommand(event);" tooltiptext="FROM-DTD-goEndCap-tooltip" inherits="pageproxystate,parentfocused=focused,usertyping">
</xul:image>
<xul:dropmarker anonid="historydropmarker" class="urlbar-history-dropmarker urlbar-icon chromeclass-toolbar-additional" tooltiptext="FROM-DTD-urlbar-openHistoryPopup-tooltip" allowevents="true" inherits="open,parentfocused=focused,usertyping">
</xul:dropmarker>
<children includes="hbox">
</children>
</xul:hbox>
<xul:popupset anonid="popupset" class="autocomplete-result-popupset">
</xul:popupset>
<children includes="toolbarbutton">
</children>`;
    Object.defineProperty(this, "ExtensionSearchHandler", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.ExtensionSearchHandler;
        return (this.ExtensionSearchHandler = Components.utils.import(
          "resource://gre/modules/ExtensionSearchHandler.jsm",
          {}
        ).ExtensionSearchHandler);
      }
    });
    Object.defineProperty(this, "goButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.goButton;
        return (this.goButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "urlbar-go-button"
        ));
      },
      set(val) {
        delete this.goButton;
        return (this.goButton = val);
      }
    });
    Object.defineProperty(this, "_value", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._value;
        return (this._value = "");
      },
      set(val) {
        delete this._value;
        return (this._value = val);
      }
    });
    Object.defineProperty(this, "gotResultForCurrentQuery", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.gotResultForCurrentQuery;
        return (this.gotResultForCurrentQuery = false);
      },
      set(val) {
        delete this.gotResultForCurrentQuery;
        return (this.gotResultForCurrentQuery = val);
      }
    });
    Object.defineProperty(this, "handleEnterInstance", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.handleEnterInstance;
        return (this.handleEnterInstance = null);
      },
      set(val) {
        delete this.handleEnterInstance;
        return (this.handleEnterInstance = val);
      }
    });
    Object.defineProperty(this, "textRunsMaxLen", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.textRunsMaxLen;
        return (this.textRunsMaxLen = 255);
      },
      set(val) {
        delete this.textRunsMaxLen;
        return (this.textRunsMaxLen = val);
      }
    });
    Object.defineProperty(this, "userInitiatedFocus", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.userInitiatedFocus;
        return (this.userInitiatedFocus = false);
      },
      set(val) {
        delete this.userInitiatedFocus;
        return (this.userInitiatedFocus = val);
      }
    });
    Object.defineProperty(this, "_keyCodesToDefer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._keyCodesToDefer;
        return (this._keyCodesToDefer = new Set([
          Ci.nsIDOMKeyEvent.DOM_VK_DOWN,
          Ci.nsIDOMKeyEvent.DOM_VK_TAB
        ]));
      },
      set(val) {
        delete this._keyCodesToDefer;
        return (this._keyCodesToDefer = val);
      }
    });
    Object.defineProperty(this, "_deferredKeyEventQueue", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._deferredKeyEventQueue;
        return (this._deferredKeyEventQueue = []);
      },
      set(val) {
        delete this._deferredKeyEventQueue;
        return (this._deferredKeyEventQueue = val);
      }
    });
    Object.defineProperty(this, "_deferredKeyEventTimeout", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._deferredKeyEventTimeout;
        return (this._deferredKeyEventTimeout = null);
      },
      set(val) {
        delete this._deferredKeyEventTimeout;
        return (this._deferredKeyEventTimeout = val);
      }
    });
    Object.defineProperty(this, "_deferredKeyEventTimeoutMs", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._deferredKeyEventTimeoutMs;
        return (this._deferredKeyEventTimeoutMs = 200);
      },
      set(val) {
        delete this._deferredKeyEventTimeoutMs;
        return (this._deferredKeyEventTimeoutMs = val);
      }
    });
    Object.defineProperty(this, "_searchStartDate", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._searchStartDate;
        return (this._searchStartDate = 0);
      },
      set(val) {
        delete this._searchStartDate;
        return (this._searchStartDate = val);
      }
    });
    Object.defineProperty(this, "_mayTrimURLs", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._mayTrimURLs;
        return (this._mayTrimURLs = true);
      },
      set(val) {
        delete this._mayTrimURLs;
        return (this._mayTrimURLs = val);
      }
    });
    Object.defineProperty(this, "_formattingEnabled", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._formattingEnabled;
        return (this._formattingEnabled = true);
      },
      set(val) {
        delete this._formattingEnabled;
        return (this._formattingEnabled = val);
      }
    });
    Object.defineProperty(this, "_copyCutController", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._copyCutController;
        return (this._copyCutController = {
          urlbar: this,
          doCommand(aCommand) {
            var urlbar = this.urlbar;
            var val = urlbar._getSelectedValueForClipboard();
            if (!val) return;

            if (aCommand == "cmd_cut" && this.isCommandEnabled(aCommand)) {
              let start = urlbar.selectionStart;
              let end = urlbar.selectionEnd;
              urlbar.inputField.value =
                urlbar.inputField.value.substring(0, start) +
                urlbar.inputField.value.substring(end);
              urlbar.selectionStart = urlbar.selectionEnd = start;

              let event = document.createEvent("UIEvents");
              event.initUIEvent("input", true, false, window, 0);
              urlbar.dispatchEvent(event);

              SetPageProxyState("invalid");
            }

            Cc["@mozilla.org/widget/clipboardhelper;1"]
              .getService(Ci.nsIClipboardHelper)
              .copyString(val);
          },
          supportsCommand(aCommand) {
            switch (aCommand) {
              case "cmd_copy":
              case "cmd_cut":
                return true;
            }
            return false;
          },
          isCommandEnabled(aCommand) {
            return (
              this.supportsCommand(aCommand) &&
              (aCommand != "cmd_cut" || !this.urlbar.readOnly) &&
              this.urlbar.selectionStart < this.urlbar.selectionEnd
            );
          },
          onEvent(aEventName) {}
        });
      },
      set(val) {
        delete this._copyCutController;
        return (this._copyCutController = val);
      }
    });
    Object.defineProperty(this, "_pressedNoActionKeys", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._pressedNoActionKeys;
        return (this._pressedNoActionKeys = new Set());
      },
      set(val) {
        delete this._pressedNoActionKeys;
        return (this._pressedNoActionKeys = val);
      }
    });

    this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("browser.urlbar.");
    this._prefs.addObserver("", this);

    this._defaultPrefs = Components.classes[
      "@mozilla.org/preferences-service;1"
    ]
      .getService(Components.interfaces.nsIPrefService)
      .getDefaultBranch("browser.urlbar.");

    Services.prefs.addObserver("browser.search.suggest.enabled", this);
    this.browserSearchSuggestEnabled = Services.prefs.getBoolPref(
      "browser.search.suggest.enabled"
    );

    this.clickSelectsAll = this._prefs.getBoolPref("clickSelectsAll");
    this.doubleClickSelectsAll = this._prefs.getBoolPref(
      "doubleClickSelectsAll"
    );
    this.completeDefaultIndex = this._prefs.getBoolPref("autoFill");
    this.speculativeConnectEnabled = this._prefs.getBoolPref(
      "speculativeConnect.enabled"
    );
    this.urlbarSearchSuggestEnabled = this._prefs.getBoolPref(
      "suggest.searches"
    );
    this.timeout = this._prefs.getIntPref("delay");
    this._formattingEnabled = this._prefs.getBoolPref("formatting.enabled");
    this._mayTrimURLs = this._prefs.getBoolPref("trimURLs");
    this._adoptIntoActiveWindow = this._prefs.getBoolPref(
      "switchTabs.adoptIntoActiveWindow"
    );
    this.inputField.controllers.insertControllerAt(0, this._copyCutController);
    this.inputField.addEventListener("paste", this);
    this.inputField.addEventListener("mousedown", this);
    this.inputField.addEventListener("mousemove", this);
    this.inputField.addEventListener("mouseout", this);
    this.inputField.addEventListener("overflow", this);
    this.inputField.addEventListener("underflow", this);

    var textBox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "textbox-input-box"
    );
    var cxmenu = document.getAnonymousElementByAttribute(
      textBox,
      "anonid",
      "input-box-contextmenu"
    );
    var pasteAndGo;
    cxmenu.addEventListener("popupshowing", function() {
      if (!pasteAndGo) return;
      var controller = document.commandDispatcher.getControllerForCommand(
        "cmd_paste"
      );
      var enabled = controller.isCommandEnabled("cmd_paste");
      if (enabled) pasteAndGo.removeAttribute("disabled");
      else pasteAndGo.setAttribute("disabled", "true");
    });

    var insertLocation = cxmenu.firstChild;
    while (
      insertLocation.nextSibling &&
      insertLocation.getAttribute("cmd") != "cmd_paste"
    )
      insertLocation = insertLocation.nextSibling;
    if (insertLocation) {
      pasteAndGo = document.createElement("menuitem");
      let label = Services.strings
        .createBundle("chrome://browser/locale/browser.properties")
        .GetStringFromName("pasteAndGo.label");
      pasteAndGo.setAttribute("label", label);
      pasteAndGo.setAttribute("anonid", "paste-and-go");
      pasteAndGo.setAttribute(
        "oncommand",
        "gURLBar.select(); goDoCommand('cmd_paste'); gURLBar.handleCommand();"
      );
      cxmenu.insertBefore(pasteAndGo, insertLocation.nextSibling);
    }

    this.popup.addEventListener(
      "popupshowing",
      () => {
        this._enableOrDisableOneOffSearches();
      },
      { capturing: true, once: true }
    );

    // history dropmarker open state
    this.popup.addEventListener("popupshowing", () => {
      this.setAttribute("open", "true");
    });
    this.popup.addEventListener("popuphidden", () => {
      requestAnimationFrame(() => {
        this.removeAttribute("open");
      });
    });

    // The autocomplete controller uses heuristic on some internal caches
    // to handle cases like backspace, autofill or repeated searches.
    // Ensure to clear those internal caches when switching tabs.
    gBrowser.tabContainer.addEventListener("TabSelect", this);

    this.addEventListener("keydown", event => {
      if (
        this._noActionKeys.has(event.keyCode) &&
        this.popup.selectedIndex >= 0 &&
        !this._pressedNoActionKeys.has(event.keyCode)
      ) {
        if (this._pressedNoActionKeys.size == 0) {
          this.popup.setAttribute("noactions", "true");
          this.removeAttribute("actiontype");
        }
        this._pressedNoActionKeys.add(event.keyCode);
      }
    });

    this.addEventListener("keyup", event => {
      if (
        this._noActionKeys.has(event.keyCode) &&
        this._pressedNoActionKeys.has(event.keyCode)
      ) {
        this._pressedNoActionKeys.delete(event.keyCode);
        if (this._pressedNoActionKeys.size == 0) this._clearNoActions();
      }
    });

    this.addEventListener("mousedown", event => {
      if (event.button == 0) {
        if (
          event.originalTarget.getAttribute("anonid") == "historydropmarker"
        ) {
          this.toggleHistoryPopup();
        }

        // Eventually show the opt-out notification even if the location bar is
        // empty, focused, and the user clicks on it.
        if (this.focused && this.textValue == "") {
          this.maybeShowSearchSuggestionsNotificationOnFocus(true);
        }
      }
    });

    this.addEventListener("focus", event => {
      if (event.originalTarget == this.inputField) {
        this._hideURLTooltip();
        this.formatValue();
        if (this.getAttribute("pageproxystate") != "valid") {
          UpdatePopupNotificationsVisibility();
        }

        // We show the opt-out notification when the mouse/keyboard focus the
        // urlbar, but in any case we want to enforce at least one
        // notification when the user focuses it with the mouse.
        let whichNotification = this.whichSearchSuggestionsNotification;
        if (
          whichNotification == "opt-out" &&
          this._showSearchSuggestionNotificationOnMouseFocus === undefined
        ) {
          this._showSearchSuggestionNotificationOnMouseFocus = true;
        }

        // Check whether the focus change came from a keyboard/mouse action.
        let focusMethod = Services.focus.getLastFocusMethod(window);
        // If it's a focus started by code and the primary user intention was
        // not to go to the location bar, don't show a notification.
        if (!focusMethod && !this.userInitiatedFocus) {
          return;
        }

        let mouseFocused = !!(focusMethod & Services.focus.FLAG_BYMOUSE);
        this.maybeShowSearchSuggestionsNotificationOnFocus(mouseFocused);
      }
    });

    this.addEventListener("blur", event => {
      if (event.originalTarget == this.inputField) {
        this._clearNoActions();
        this.formatValue();
        if (this.getAttribute("pageproxystate") != "valid") {
          UpdatePopupNotificationsVisibility();
        }
      }
      if (this.ExtensionSearchHandler.hasActiveInputSession()) {
        this.ExtensionSearchHandler.handleInputCancelled();
      }
      if (this._deferredKeyEventTimeout) {
        clearTimeout(this._deferredKeyEventTimeout);
        this._deferredKeyEventTimeout = null;
      }
      this._deferredKeyEventQueue = [];
    });

    this.addEventListener(
      "dragstart",
      event => {
        // Drag only if the gesture starts from the input field.
        if (
          this.inputField != event.originalTarget &&
          !(
            this.inputField.compareDocumentPosition(event.originalTarget) &
            Node.DOCUMENT_POSITION_CONTAINED_BY
          )
        )
          return;

        // Drag only if the entire value is selected and it's a valid URI.
        var isFullSelection =
          this.selectionStart == 0 && this.selectionEnd == this.textLength;
        if (!isFullSelection || this.getAttribute("pageproxystate") != "valid")
          return;

        var urlString = gBrowser.selectedBrowser.currentURI.displaySpec;
        var title = gBrowser.selectedBrowser.contentTitle || urlString;
        var htmlString = '<a href="' + urlString + '">' + urlString + "</a>";

        var dt = event.dataTransfer;
        dt.setData("text/x-moz-url", urlString + "\n" + title);
        dt.setData("text/unicode", urlString);
        dt.setData("text/html", htmlString);

        dt.effectAllowed = "copyLink";
        event.stopPropagation();
      },
      true
    );

    this.addEventListener(
      "dragover",
      event => {
        this.onDragOver(event, this);
      },
      true
    );

    this.addEventListener(
      "drop",
      event => {
        this.onDrop(event, this);
      },
      true
    );

    this.addEventListener("select", event => {
      if (
        !Cc["@mozilla.org/widget/clipboard;1"]
          .getService(Ci.nsIClipboard)
          .supportsSelectionClipboard()
      )
        return;

      if (
        !window
          .QueryInterface(Ci.nsIInterfaceRequestor)
          .getInterface(Ci.nsIDOMWindowUtils).isHandlingUserInput
      )
        return;

      var val = this._getSelectedValueForClipboard();
      if (!val) return;

      Cc["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Ci.nsIClipboardHelper)
        .copyStringToClipboard(val, Ci.nsIClipboard.kSelectionClipboard);
    });
  }
  disconnectedCallback() {
    this._prefs.removeObserver("", this);
    this._prefs = null;
    Services.prefs.removeObserver("browser.search.suggest.enabled", this);
    this.inputField.controllers.removeController(this._copyCutController);
    this.inputField.removeEventListener("paste", this);
    this.inputField.removeEventListener("mousedown", this);
    this.inputField.removeEventListener("mousemove", this);
    this.inputField.removeEventListener("mouseout", this);
    this.inputField.removeEventListener("overflow", this);
    this.inputField.removeEventListener("underflow", this);

    if (this._deferredKeyEventTimeout) {
      clearTimeout(this._deferredKeyEventTimeout);
      this._deferredKeyEventTimeout = null;
    }

    // Null out the one-offs' popup and textbox so that it cleans up its
    // internal state for both.  Most importantly, it removes the event
    // listeners that it added to both.
    this.popup.oneOffSearchButtons.popup = null;
    this.popup.oneOffSearchButtons.textbox = null;
  }

  get maxRows() {
    return this.popup.maxResults;
  }

  get oneOffSearchQuery() {
    // If the user has selected a search suggestion, chances are they
    // want to use the one off search engine to search for that suggestion,
    // not the string that they manually entered into the location bar.
    let action = this._parseActionUrl(this.value);
    if (action && action.type == "searchengine") {
      return action.params.input;
    }
    // this.textValue may be an autofilled string.  Search only with the
    // portion that the user typed, if any, by preferring the autocomplete
    // controller's searchString (including handleEnterInstance.searchString).
    return (
      this.handleEnterSearchString ||
      this.mController.searchString ||
      this.textValue
    );
  }

  get _noActionKeys() {
    if (!this.__noActionKeys) {
      this.__noActionKeys = new Set([
        KeyEvent.DOM_VK_ALT,
        KeyEvent.DOM_VK_SHIFT
      ]);
      let modifier = AppConstants.platform == "macosx"
        ? KeyEvent.DOM_VK_META
        : KeyEvent.DOM_VK_CONTROL;
      this.__noActionKeys.add(modifier);
    }
    return this.__noActionKeys;
  }

  get _userMadeSearchSuggestionsChoice() {
    return (
      this._prefs.getBoolPref("userMadeSearchSuggestionsChoice") ||
      this._defaultPrefs.getBoolPref("suggest.searches") !=
        this._prefs.getBoolPref("suggest.searches")
    );
  }

  get whichSearchSuggestionsNotification() {
    // Once we return "none" once, we'll always return "none".
    // If available, use the cached value, rather than running all of the
    // checks again at every locationbar focus.
    if (this._whichSearchSuggestionsNotification) {
      return this._whichSearchSuggestionsNotification;
    }

    if (
      this.browserSearchSuggestEnabled &&
      !this.inPrivateContext &&
      // In any case, if the user made a choice we should not nag him.
      !this._userMadeSearchSuggestionsChoice
    ) {
      if (
        this._defaultPrefs.getBoolPref("suggest.searches") &&
        this.urlbarSearchSuggestEnabled && // Has not been switched off.
        this._prefs.getIntPref("timesBeforeHidingSuggestionsHint")
      ) {
        return "opt-out";
      }
    }
    return (this._whichSearchSuggestionsNotification = "none");
  }
  onBeforeValueGet() {
    return { value: this._value };
  }
  onBeforeValueSet(aValue) {
    this._value = aValue;
    var returnValue = aValue;
    var action = this._parseActionUrl(aValue);

    if (action) {
      switch (action.type) {
        case "switchtab": // Fall through.
        case "remotetab": // Fall through.
        case "visiturl": {
          returnValue = action.params.displayUrl;
          break;
        }
        case "keyword": // Fall through.
        case "searchengine": {
          returnValue = action.params.input;
          break;
        }
        case "extension": {
          returnValue = action.params.content;
          break;
        }
      }
    } else {
      let originalUrl = ReaderMode.getOriginalUrlObjectForDisplay(aValue);
      if (originalUrl) {
        returnValue = originalUrl.displaySpec;
      }
    }

    // Set the actiontype only if the user is not overriding actions.
    if (action && this._pressedNoActionKeys.size == 0) {
      this.setAttribute("actiontype", action.type);
    } else {
      this.removeAttribute("actiontype");
    }
    return returnValue;
  }
  onKeyPress(aEvent) {
    switch (aEvent.keyCode) {
      case KeyEvent.DOM_VK_LEFT:
      case KeyEvent.DOM_VK_RIGHT:
      case KeyEvent.DOM_VK_HOME:
        // Reset the selected index so that nsAutoCompleteController
        // simply closes the popup without trying to fill anything.
        this.popup.selectedIndex = -1;
        break;
    }
    if (!this.popup.disableKeyNavigation) {
      if (
        this._keyCodesToDefer.has(aEvent.keyCode) &&
        this._shouldDeferKeyEvent(aEvent)
      ) {
        this._deferKeyEvent(aEvent, "onKeyPress");
        return false;
      }
      if (this.popup.popupOpen && this.popup.handleKeyPress(aEvent)) {
        return true;
      }
    }
    return this.handleKeyPress(aEvent);
  }
  _shouldDeferKeyEvent(event) {
    let waitedLongEnough =
      this._searchStartDate + this._deferredKeyEventTimeoutMs < Date.now();
    if (waitedLongEnough && !this._deferredKeyEventTimeout) {
      return false;
    }
    if (event && event.keyCode == KeyEvent.DOM_VK_TAB && !this.popupOpen) {
      // In this case, the popup is closed and the user pressed the Tab
      // key.  The focus should move out of the urlbar immediately.
      return false;
    }
    if (!this.gotResultForCurrentQuery || !this.popupOpen) {
      return true;
    }
    let maxResultsRemaining = this.popup.maxResults - this.popup._matchCount;
    let lastResultSelected =
      this.popup.selectedIndex + 1 == this.popup._matchCount;
    return maxResultsRemaining > 0 && lastResultSelected;
  }
  _deferKeyEvent(event, methodName) {
    // Somehow event.defaultPrevented ends up true for deferred events.
    // autocomplete ignores defaultPrevented events, which means it would
    // ignore replayed deferred events if we didn't tell it to bypass
    // defaultPrevented.  That's the purpose of this expando.  If we could
    // figure out what's setting defaultPrevented and prevent it, then we
    // could get rid of this.
    event.urlbarDeferred = true;

    this._deferredKeyEventQueue.push({
      methodName,
      event,
      searchString: this.mController.searchString
    });

    if (!this._deferredKeyEventTimeout) {
      this._deferredKeyEventTimeout = setTimeout(() => {
        this._deferredKeyEventTimeout = null;
        this.maybeReplayDeferredKeyEvents();
      }, this._deferredKeyEventTimeoutMs);
    }
  }
  maybeReplayDeferredKeyEvents() {
    if (!this._deferredKeyEventQueue.length || this._shouldDeferKeyEvent()) {
      return;
    }
    if (this._deferredKeyEventTimeout) {
      clearTimeout(this._deferredKeyEventTimeout);
      this._deferredKeyEventTimeout = null;
    }
    let instance = this._deferredKeyEventQueue.shift();
    // Safety check: handle only if the search string didn't change.
    if (this.mController.searchString == instance.searchString) {
      this[instance.methodName](instance.event);
    }
    setTimeout(() => {
      this.maybeReplayDeferredKeyEvents();
    });
  }
  trimValue(aURL) {
    // This method must not modify the given URL such that calling
    // nsIURIFixup::createFixupURI with the result will produce a different URI.
    return this._mayTrimURLs ? trimURL(aURL) : aURL;
  }
  formatValue() {
    if (!this._formattingEnabled || !this.editor) return;

    let controller = this.editor.selectionController;
    let strikeOut = controller.getSelection(controller.SELECTION_URLSTRIKEOUT);
    strikeOut.removeAllRanges();

    let selection = controller.getSelection(controller.SELECTION_URLSECONDARY);
    selection.removeAllRanges();

    if (this.focused) return;

    let textNode = this.editor.rootElement.firstChild;
    let value = textNode.textContent;
    if (!value) return;

    // Get the URL from the fixup service:
    let flags =
      Services.uriFixup.FIXUP_FLAG_FIX_SCHEME_TYPOS |
      Services.uriFixup.FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP;
    let uriInfo;
    try {
      uriInfo = Services.uriFixup.getFixupURIInfo(value, flags);
    } catch (ex) {}
    // Ignore if we couldn't make a URI out of this, the URI resulted in a search,
    // or the URI has a non-http(s)/ftp protocol.
    if (
      !uriInfo ||
      !uriInfo.fixedURI ||
      uriInfo.keywordProviderName ||
      ["http", "https", "ftp"].indexOf(uriInfo.fixedURI.scheme) == -1
    ) {
      return;
    }

    // If we trimmed off the http scheme, ensure we stick it back on before
    // trying to figure out what domain we're accessing, so we don't get
    // confused by user:pass@host http URLs. We later use
    // trimmedLength to ensure we don't count the length of a trimmed protocol
    // when determining which parts of the URL to highlight as "preDomain".
    let trimmedLength = 0;
    if (uriInfo.fixedURI.scheme == "http" && !value.startsWith("http://")) {
      value = "http://" + value;
      trimmedLength = "http://".length;
    }

    let matchedURL = value.match(
      /^((?:[a-z]+:\/\/)(?:[^\/#?]+@)?)(\S+?)(?::\d+)?\s*(?:[\/#?]|$)/
    );
    if (!matchedURL) return;

    // Strike out the "https" part if mixed active content is loaded.
    if (
      this.getAttribute("pageproxystate") == "valid" &&
      value.startsWith("https:") &&
      gBrowser.securityUI.state &
        Ci.nsIWebProgressListener.STATE_LOADED_MIXED_ACTIVE_CONTENT
    ) {
      let range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 5);
      strikeOut.addRange(range);
    }

    let [, preDomain, domain] = matchedURL;
    let baseDomain = domain;
    let subDomain = "";
    try {
      baseDomain = Services.eTLD.getBaseDomainFromHost(uriInfo.fixedURI.host);
      if (!domain.endsWith(baseDomain)) {
        // getBaseDomainFromHost converts its resultant to ACE.
        let IDNService = Cc["@mozilla.org/network/idn-service;1"].getService(
          Ci.nsIIDNService
        );
        baseDomain = IDNService.convertACEtoUTF8(baseDomain);
      }
    } catch (e) {}
    if (baseDomain != domain) {
      subDomain = domain.slice(0, -baseDomain.length);
    }

    let rangeLength = preDomain.length + subDomain.length - trimmedLength;
    if (rangeLength) {
      let range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, rangeLength);
      selection.addRange(range);
    }

    let startRest = preDomain.length + domain.length - trimmedLength;
    if (startRest < value.length - trimmedLength) {
      let range = document.createRange();
      range.setStart(textNode, startRest);
      range.setEnd(textNode, value.length - trimmedLength);
      selection.addRange(range);
    }
  }
  handleRevert() {
    var isScrolling = this.popupOpen;

    gBrowser.userTypedValue = null;

    // don't revert to last valid url unless page is NOT loading
    // and user is NOT key-scrolling through autocomplete list
    if (!XULBrowserWindow.isBusy && !isScrolling) {
      URLBarSetURI();

      // If the value isn't empty and the urlbar has focus, select the value.
      if (this.value && this.hasAttribute("focused")) this.select();
    }

    // tell widget to revert to last typed text only if the user
    // was scrolling when they hit escape
    return !isScrolling;
  }
  handleCommand(event, openUILinkWhere, openUILinkParams) {
    let isMouseEvent = event instanceof MouseEvent;
    if (isMouseEvent && event.button == 2) {
      // Do nothing for right clicks.
      return;
    }

    BrowserUsageTelemetry.recordUrlbarSelectedResultMethod(event);

    // Determine whether to use the selected one-off search button.  In
    // one-off search buttons parlance, "selected" means that the button
    // has been navigated to via the keyboard.  So we want to use it if
    // the triggering event is not a mouse click -- i.e., it's a Return
    // key -- or if the one-off was mouse-clicked.
    let selectedOneOff = this.popup.oneOffSearchButtons.selectedButton;
    if (
      selectedOneOff &&
      isMouseEvent &&
      event.originalTarget != selectedOneOff
    ) {
      selectedOneOff = null;
    }

    // Do the command of the selected one-off if it's not an engine.
    if (selectedOneOff && !selectedOneOff.engine) {
      selectedOneOff.doCommand();
      return;
    }

    let where = openUILinkWhere;
    if (!where) {
      if (isMouseEvent) {
        where = whereToOpenLink(event, false, false);
      } else {
        // If the current tab is empty, ignore Alt+Enter (reuse this tab)
        let altEnter =
          !isMouseEvent &&
          event &&
          event.altKey &&
          !isTabEmpty(gBrowser.selectedTab);
        where = altEnter ? "tab" : "current";
      }
    }

    let url = this.value;
    if (!url) {
      return;
    }

    let mayInheritPrincipal = false;
    let postData = null;
    let browser = gBrowser.selectedBrowser;
    let action = this._parseActionUrl(url);

    if (selectedOneOff && selectedOneOff.engine) {
      // If there's a selected one-off button then load a search using
      // the one-off's engine.
      [url, postData] = this._parseAndRecordSearchEngineLoad(
        selectedOneOff.engine,
        this.oneOffSearchQuery,
        event,
        where,
        openUILinkParams
      );
    } else if (action) {
      switch (action.type) {
        case "visiturl":
          // Unifiedcomplete uses fixupURI to tell if something is a visit
          // or a search, and passes out the fixedURI as the url param.
          // By using that uri we would end up passing a different string
          // to the docshell that may run a different not-found heuristic.
          // For example, "mozilla/run" would be fixed by unifiedcomplete
          // to "http://mozilla/run". The docshell, once it can't resolve
          // mozilla, would note the string has a scheme, and try to load
          // http://mozilla.com/run instead of searching "mozilla/run".
          // So, if we have the original input at hand, we pass it through
          // and let the docshell handle it.
          if (action.params.input) {
            url = action.params.input;
            break;
          }
          url = action.params.url;
          break;
        case "remotetab":
          url = action.params.url;
          break;
        case "keyword":
          if (action.params.postData) {
            postData = getPostDataStream(action.params.postData);
          }
          mayInheritPrincipal = true;
          url = action.params.url;
          break;
        case "switchtab":
          url = action.params.url;
          if (this.hasAttribute("actiontype")) {
            this.handleRevert();
            let prevTab = gBrowser.selectedTab;
            let loadOpts = {
              adoptIntoActiveWindow: this._adoptIntoActiveWindow
            };

            if (
              switchToTabHavingURI(url, false, loadOpts) &&
              isTabEmpty(prevTab)
            ) {
              gBrowser.removeTab(prevTab);
            }
            return;
          }
          break;
        case "searchengine":
          if (selectedOneOff && selectedOneOff.engine) {
            // Replace the engine with the selected one-off engine.
            action.params.engineName = selectedOneOff.engine.name;
          }
          const actionDetails = {
            isSuggestion: !!action.params.searchSuggestion,
            isAlias: !!action.params.alias
          };
          [url, postData] = this._parseAndRecordSearchEngineLoad(
            action.params.engineName,
            action.params.searchSuggestion || action.params.searchQuery,
            event,
            where,
            openUILinkParams,
            actionDetails
          );
          break;
        case "extension":
          this.handleRevert();
          // Give the extension control of handling the command.
          let searchString = action.params.content;
          let keyword = action.params.keyword;
          this.ExtensionSearchHandler.handleInputEntered(
            keyword,
            searchString,
            where
          );
          return;
      }
    } else {
      // This is a fallback for add-ons and old testing code that directly
      // set value and try to confirm it. UnifiedComplete should always
      // resolve to a valid url.
      try {
        new URL(url);
      } catch (ex) {
        let lastLocationChange = browser.lastLocationChange;
        getShortcutOrURIAndPostData(url).then(data => {
          if (
            where != "current" ||
            browser.lastLocationChange == lastLocationChange
          ) {
            this._loadURL(
              data.url,
              browser,
              data.postData,
              where,
              openUILinkParams,
              data.mayInheritPrincipal
            );
          }
        });
        return;
      }
    }

    this._loadURL(
      url,
      browser,
      postData,
      where,
      openUILinkParams,
      mayInheritPrincipal
    );
  }
  _loadURL(
    url,
    browser,
    postData,
    openUILinkWhere,
    openUILinkParams,
    mayInheritPrincipal
  ) {
    this.value = url;
    browser.userTypedValue = url;
    if (gInitialPages.includes(url)) {
      browser.initialPageLoadedFromURLBar = url;
    }
    try {
      addToUrlbarHistory(url);
    } catch (ex) {
      // Things may go wrong when adding url to session history,
      // but don't let that interfere with the loading of the url.
      Cu.reportError(ex);
    }

    let params = {
      postData,
      allowThirdPartyFixup: true
    };
    if (openUILinkWhere == "current") {
      params.targetBrowser = browser;
      params.indicateErrorPageLoad = true;
      params.allowPinnedTabHostChange = true;
      params.disallowInheritPrincipal = !mayInheritPrincipal;
      params.allowPopups = url.startsWith("javascript:");
    } else {
      params.initiatingDoc = document;
    }

    if (openUILinkParams) {
      for (let key in openUILinkParams) {
        params[key] = openUILinkParams[key];
      }
    }

    // Focus the content area before triggering loads, since if the load
    // occurs in a new tab, we want focus to be restored to the content
    // area when the current tab is re-selected.
    browser.focus();

    if (openUILinkWhere != "current") {
      this.handleRevert();
    }

    try {
      openUILinkIn(url, openUILinkWhere, params);
    } catch (ex) {
      // This load can throw an exception in certain cases, which means
      // we'll want to replace the URL with the loaded URL:
      if (ex.result != Cr.NS_ERROR_LOAD_SHOWED_ERRORPAGE) {
        this.handleRevert();
      }
    }

    if (openUILinkWhere == "current") {
      // Ensure the start of the URL is visible for usability reasons.
      this.selectionStart = this.selectionEnd = 0;
    }
  }
  _parseAndRecordSearchEngineLoad(
    engineOrEngineName,
    query,
    event,
    openUILinkWhere,
    openUILinkParams,
    searchActionDetails
  ) {
    let engine = typeof engineOrEngineName == "string"
      ? Services.search.getEngineByName(engineOrEngineName)
      : engineOrEngineName;
    let isOneOff = this.popup.oneOffSearchButtons.maybeRecordTelemetry(
      event,
      openUILinkWhere,
      openUILinkParams
    );
    // Infer the type of the event which triggered the search.
    let eventType = "unknown";
    if (event instanceof KeyboardEvent) {
      eventType = "key";
    } else if (event instanceof MouseEvent) {
      eventType = "mouse";
    }
    // Augment the search action details object.
    let details = searchActionDetails || {};
    details.isOneOff = isOneOff;
    details.type = eventType;

    BrowserSearch.recordSearchInTelemetry(engine, "urlbar", details);
    let submission = engine.getSubmission(query, null, "keyword");
    return [submission.uri.spec, submission.postData];
  }
  maybeCanonizeURL(aTriggeringEvent, aUrl) {
    // Only add the suffix when the URL bar value isn't already "URL-like",
    // and only if we get a keyboard event, to match user expectations.
    if (
      !/^\s*[^.:\/\s]+(?:\/.*|\s*)$/i.test(aUrl) ||
      !(aTriggeringEvent instanceof KeyboardEvent)
    ) {
      return;
    }

    let url = aUrl;
    let accel = AppConstants.platform == "macosx"
      ? aTriggeringEvent.metaKey
      : aTriggeringEvent.ctrlKey;
    let shift = aTriggeringEvent.shiftKey;
    let suffix = "";

    switch (true) {
      case accel && shift:
        suffix = ".org/";
        break;
      case shift:
        suffix = ".net/";
        break;
      case accel:
        try {
          suffix = gPrefService.getCharPref("browser.fixup.alternate.suffix");
          if (suffix.charAt(suffix.length - 1) != "/") suffix += "/";
        } catch (e) {
          suffix = ".com/";
        }
        break;
    }

    if (!suffix) return;

    // trim leading/trailing spaces (bug 233205)
    url = url.trim();

    // Tack www. and suffix on.  If user has appended directories, insert
    // suffix before them (bug 279035).  Be careful not to get two slashes.
    let firstSlash = url.indexOf("/");
    if (firstSlash >= 0) {
      url =
        url.substring(0, firstSlash) + suffix + url.substring(firstSlash + 1);
    } else {
      url = url + suffix;
    }

    this.popup.overrideValue = "http://www." + url;
  }
  _initURLTooltip() {
    if (this.focused || !this.hasAttribute("textoverflow")) return;
    this.inputField.setAttribute("tooltiptext", this.value);
  }
  _hideURLTooltip() {
    this.inputField.removeAttribute("tooltiptext");
  }
  _getDroppableItem(aEvent) {
    let links;
    try {
      links = browserDragAndDrop.dropLinks(aEvent);
    } catch (ex) {
      // this is possibly a security exception, in which case we should return
      // null. Always return null because we can't *know* what exception is
      // being returned.
      return null;
    }
    // The URL bar automatically handles inputs with newline characters,
    // so we can get away with treating text/x-moz-url flavours as text/plain.
    if (links.length > 0 && links[0].url) {
      aEvent.preventDefault();
      let url = links[0].url;
      let strippedURL = stripUnsafeProtocolOnPaste(url);
      if (strippedURL != url) {
        aEvent.stopImmediatePropagation();
        return null;
      }
      let urlObj;
      try {
        // If this throws, urlSecurityCheck would also throw, as that's what it
        // does with things that don't pass the IO service's newURI constructor
        // without fixup. It's conceivable we may want to relax this check in
        // the future (so e.g. www.foo.com gets fixed up), but not right now.
        urlObj = new URL(url);
        // If we succeed, try to pass security checks. If this works, return the
        // URL object. If the *security checks* fail, return null.
        try {
          urlSecurityCheck(
            url,
            gBrowser.contentPrincipal,
            Ci.nsIScriptSecurityManager.DISALLOW_INHERIT_PRINCIPAL
          );
          return urlObj;
        } catch (ex) {
          return null;
        }
      } catch (ex) {
        // We couldn't make a URL out of this. Continue on, and return text below.
      }
    }
    return aEvent.dataTransfer.getData("text/unicode");
  }
  onDragOver(aEvent) {
    if (!this._getDroppableItem(aEvent)) {
      aEvent.dataTransfer.dropEffect = "none";
    }
  }
  onDrop(aEvent) {
    let droppedItem = this._getDroppableItem(aEvent);
    if (droppedItem) {
      this.value = droppedItem instanceof URL ? droppedItem.href : droppedItem;
      SetPageProxyState("invalid");
      this.focus();
      if (droppedItem instanceof URL) {
        this.handleCommand();
        // Force not showing the dropped URI immediately.
        gBrowser.userTypedValue = null;
        URLBarSetURI();
      }
    }
  }
  makeURIReadable(aURI) {
    // Avoid copying 'about:reader?url=', and always provide the original URI:
    // Reader mode ensures we call createExposableURI itself.
    let readerStrippedURI = ReaderMode.getOriginalUrlObjectForDisplay(
      aURI.displaySpec
    );
    if (readerStrippedURI) {
      aURI = readerStrippedURI;
    } else {
      // Only copy exposable URIs
      try {
        aURI = Services.uriFixup.createExposableURI(aURI);
      } catch (ex) {}
    }
    return aURI;
  }
  _getSelectedValueForClipboard() {
    // Grab the actual input field's value, not our value, which could include moz-action:
    var inputVal = this.inputField.value;
    let selection = this.editor.selection;
    const flags =
      Ci.nsIDocumentEncoder.OutputPreformatted |
      Ci.nsIDocumentEncoder.OutputRaw;
    let selectedVal = selection
      .QueryInterface(Ci.nsISelectionPrivate)
      .toStringWithFormat("text/plain", flags, 0);

    // Handle multiple-range selection as a string for simplicity.
    if (selection.rangeCount > 1) {
      return selectedVal;
    }

    // If the selection doesn't start at the beginning or doesn't span the full domain or
    // the URL bar is modified or there is no text at all, nothing else to do here.
    if (this.selectionStart > 0 || this.valueIsTyped || selectedVal == "")
      return selectedVal;
    // The selection doesn't span the full domain if it doesn't contain a slash and is
    // followed by some character other than a slash.
    if (!selectedVal.includes("/")) {
      let remainder = inputVal.replace(selectedVal, "");
      if (remainder != "" && remainder[0] != "/") return selectedVal;
    }

    let uriFixup = Cc["@mozilla.org/docshell/urifixup;1"].getService(
      Ci.nsIURIFixup
    );

    let uri;
    if (this.getAttribute("pageproxystate") == "valid") {
      uri = gBrowser.currentURI;
    } else {
      // We're dealing with an autocompleted value, create a new URI from that.
      try {
        uri = uriFixup.createFixupURI(inputVal, Ci.nsIURIFixup.FIXUP_FLAG_NONE);
      } catch (e) {}
      if (!uri) return selectedVal;
    }

    uri = this.makeURIReadable(uri);

    // If the entire URL is selected, just use the actual loaded URI,
    // unless we want a decoded URI, or it's a data: or javascript: URI,
    // since those are hard to read when encoded.
    if (
      inputVal == selectedVal &&
      !uri.schemeIs("javascript") &&
      !uri.schemeIs("data") &&
      !Services.prefs.getBoolPref("browser.urlbar.decodeURLsOnCopy")
    ) {
      return uri.displaySpec;
    }

    // Just the beginning of the URL is selected, or we want a decoded
    // url. First check for a trimmed value.
    let spec = uri.displaySpec;
    let trimmedSpec = this.trimValue(spec);
    if (spec != trimmedSpec) {
      // Prepend the portion that trimValue removed from the beginning.
      // This assumes trimValue will only truncate the URL at
      // the beginning or end (or both).
      let trimmedSegments = spec.split(trimmedSpec);
      selectedVal = trimmedSegments[0] + selectedVal;
    }

    return selectedVal;
  }
  observe(aSubject, aTopic, aData) {
    if (aTopic == "nsPref:changed") {
      switch (aData) {
        case "clickSelectsAll":
        case "doubleClickSelectsAll":
          this[aData] = this._prefs.getBoolPref(aData);
          break;
        case "autoFill":
          this.completeDefaultIndex = this._prefs.getBoolPref(aData);
          break;
        case "delay":
          this.timeout = this._prefs.getIntPref(aData);
          break;
        case "formatting.enabled":
          this._formattingEnabled = this._prefs.getBoolPref(aData);
          break;
        case "speculativeConnect.enabled":
          this.speculativeConnectEnabled = this._prefs.getBoolPref(aData);
          break;
        case "browser.search.suggest.enabled":
          this.browserSearchSuggestEnabled = Services.prefs.getBoolPref(aData);
          break;
        case "suggest.searches":
          this.urlbarSearchSuggestEnabled = this._prefs.getBoolPref(aData);
        case "userMadeSearchSuggestionsChoice":
          // Mirror the value for future use, see the comment in the
          // binding's constructor.
          this._prefs.setBoolPref(
            "searchSuggestionsChoice",
            this.urlbarSearchSuggestEnabled
          );
          // Clear the cached value to allow changing conditions in tests.
          delete this._whichSearchSuggestionsNotification;
          break;
        case "trimURLs":
          this._mayTrimURLs = this._prefs.getBoolPref(aData);
          break;
        case "oneOffSearches":
          this._enableOrDisableOneOffSearches();
          break;
        case "maxRichResults":
          this.popup.maxResults = this._prefs.getIntPref(aData);
          break;
        case "switchTabs.adoptIntoActiveWindow":
          this._adoptIntoActiveWindow = this._prefs.getBoolPref(
            "switchTabs.adoptIntoActiveWindow"
          );
          break;
      }
    }
  }
  _enableOrDisableOneOffSearches() {
    let enable = this._prefs.getBoolPref("oneOffSearches");
    this.popup.enableOneOffSearches(enable);
  }
  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "paste":
        let originalPasteData = aEvent.clipboardData.getData("text/plain");
        if (!originalPasteData) {
          return;
        }

        let oldValue = this.inputField.value;
        let oldStart = oldValue.substring(0, this.inputField.selectionStart);
        // If there is already non-whitespace content in the URL bar
        // preceding the pasted content, it's not necessary to check
        // protocols used by the pasted content:
        if (oldStart.trim()) {
          return;
        }
        let oldEnd = oldValue.substring(this.inputField.selectionEnd);

        let pasteData = stripUnsafeProtocolOnPaste(originalPasteData);
        if (originalPasteData != pasteData) {
          // Unfortunately we're not allowed to set the bits being pasted
          // so cancel this event:
          aEvent.preventDefault();
          aEvent.stopImmediatePropagation();

          this.inputField.value = oldStart + pasteData + oldEnd;
          // Fix up cursor/selection:
          let newCursorPos = oldStart.length + pasteData.length;
          this.inputField.selectionStart = newCursorPos;
          this.inputField.selectionEnd = newCursorPos;
        }
        break;
      case "mousedown":
        if (
          this.doubleClickSelectsAll &&
          aEvent.button == 0 &&
          aEvent.detail == 2
        ) {
          this.editor.selectAll();
          aEvent.preventDefault();
        }
        break;
      case "mousemove":
        this._initURLTooltip();
        break;
      case "mouseout":
        this._hideURLTooltip();
        break;
      case "overflow":
        if (!this.value) {
          // We initially get a spurious overflow event from the
          // anonymous div containing the placeholder text; bail out.
          break;
        }
        this.setAttribute("textoverflow", "true");
        break;
      case "underflow":
        this.removeAttribute("textoverflow");
        this._hideURLTooltip();
        break;
      case "TabSelect":
        this.controller.resetInternalState();
        break;
    }
  }
  onBeforeTextValueGet() {
    return { value: this.inputField.value };
  }
  onBeforeTextValueSet(aValue) {
    let val = aValue;
    let uri;
    try {
      uri = makeURI(val);
    } catch (ex) {}

    if (uri) {
      // Do not touch moz-action URIs at all.  They depend on being
      // properly encoded and decoded and will break if decoded
      // unexpectedly.
      if (!this._parseActionUrl(val)) {
        val = losslessDecodeURI(uri);
      }
    }

    return val;
  }
  _parseActionUrl(aUrl) {
    const MOZ_ACTION_REGEX = /^moz-action:([^,]+),(.*)$/;
    if (!MOZ_ACTION_REGEX.test(aUrl)) return null;

    // URL is in the format moz-action:ACTION,PARAMS
    // Where PARAMS is a JSON encoded object.
    let [, type, params] = aUrl.match(MOZ_ACTION_REGEX);

    let action = {
      type
    };

    action.params = JSON.parse(params);
    for (let key in action.params) {
      action.params[key] = decodeURIComponent(action.params[key]);
    }

    if ("url" in action.params) {
      let uri;
      try {
        uri = makeURI(action.params.url);
        action.params.displayUrl = losslessDecodeURI(uri);
      } catch (e) {
        action.params.displayUrl = action.params.url;
      }
    }

    return action;
  }
  _clearNoActions(aURL) {
    this._pressedNoActionKeys.clear();
    this.popup.removeAttribute("noactions");
    let action = this._parseActionUrl(this._value);
    if (action) this.setAttribute("actiontype", action.type);
  }
  onInput(aEvent) {
    if (!this.mIgnoreInput && this.mController.input == this) {
      this._value = this.inputField.value;
      gBrowser.userTypedValue = this.value;
      this.valueIsTyped = true;
      if (this.inputField.value) {
        this.setAttribute("usertyping", "true");
      } else {
        this.removeAttribute("usertyping");
      }
      // Only wait for a result when we are sure to get one.  In some
      // cases, like when pasting the same exact text, we may not fire
      // a new search and we won't get a result.
      if (this.mController.handleText()) {
        this.gotResultForCurrentQuery = false;
        this._searchStartDate = Date.now();
        this._deferredKeyEventQueue = [];
        if (this._deferredKeyEventTimeout) {
          clearTimeout(this._deferredKeyEventTimeout);
          this._deferredKeyEventTimeout = null;
        }
      }
    }
    this.resetActionType();
  }
  handleEnter(event) {
    // We need to ensure we're using a selected autocomplete result.
    // A result should automatically be selected by default,
    // however autocomplete is async and therefore we may not
    // have a result set relating to the current input yet. If that
    // happens, we need to mark that when the first result does get added,
    // it needs to be handled as if enter was pressed with that first
    // result selected.
    // If anything other than the default (first) result is selected, then
    // it must have been manually selected by the human. We let this
    // explicit choice be used, even if it may be related to a previous
    // input.
    // However, if the default result is automatically selected, we
    // ensure that it corresponds to the current input.

    // Store the current search string so it can be used in handleCommand,
    // which will be called as a result of mController.handleEnter().
    this.handleEnterSearchString = this.mController.searchString;

    if (
      !this._deferredKeyEventQueue.length &&
      (this.popup.selectedIndex != 0 || this.gotResultForCurrentQuery)
    ) {
      let canonizeValue = this.value;
      if (
        event.shiftKey ||
        (AppConstants.platform === "macosx" ? event.metaKey : event.ctrlKey)
      ) {
        let action = this._parseActionUrl(canonizeValue);
        if (action && "searchSuggestion" in action.params) {
          canonizeValue = action.params.searchSuggestion;
        } else if (
          this.popup.selectedIndex === 0 &&
          this.mController.getStyleAt(0).includes("autofill")
        ) {
          canonizeValue = this.handleEnterSearchString;
        }
      }
      this.maybeCanonizeURL(event, canonizeValue);
      let handled = this.mController.handleEnter(false, event);
      this.handleEnterSearchString = null;
      this.popup.overrideValue = null;
      return handled;
    }

    // Defer the event until the first non-heuristic result comes in.
    this._deferKeyEvent(event, "handleEnter");
    return false;
  }
  handleDelete() {
    // If the heuristic result is selected, then the autocomplete
    // controller's handleDelete implementation will remove it, which is
    // not what we want.  So in that case, call handleText so it acts as
    // a backspace on the text value instead of removing the result.
    if (this.popup.selectedIndex == 0 && this.popup._isFirstResultHeuristic) {
      this.mController.handleText();
      return false;
    }
    return this.mController.handleDelete();
  }
  updateSearchSuggestionsNotificationImpressions(whichNotification) {
    if (whichNotification == "none") {
      throw new Error("Unexpected notification type");
    }

    let remaining = this._prefs.getIntPref("timesBeforeHidingSuggestionsHint");
    if (remaining > 0) {
      this._prefs.setIntPref("timesBeforeHidingSuggestionsHint", remaining - 1);
    }
  }
  maybeShowSearchSuggestionsNotificationOnFocus(mouseFocused) {
    let whichNotification = this.whichSearchSuggestionsNotification;
    if (this._showSearchSuggestionNotificationOnMouseFocus && mouseFocused) {
      // Force showing the opt-out notification.
      this._whichSearchSuggestionsNotification = whichNotification = "opt-out";
    }
    if (whichNotification == "opt-out") {
      try {
        this.popup.openAutocompletePopup(this, this);
      } finally {
        if (mouseFocused) {
          delete this._whichSearchSuggestionsNotification;
          this._showSearchSuggestionNotificationOnMouseFocus = false;
        }
      }
    }
  }
}
customElements.define("firefox-urlbar", FirefoxUrlbar);
