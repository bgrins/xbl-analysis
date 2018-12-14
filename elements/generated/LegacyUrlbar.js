/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozLegacyUrlbar extends MozAutocomplete {
  constructor() {
    super();

    this.addEventListener("keydown", (event) => {
      if (this._noActionKeys.has(event.keyCode) &&
        this.popup.selectedIndex >= 0 &&
        !this._pressedNoActionKeys.has(event.keyCode)) {
        if (this._pressedNoActionKeys.size == 0) {
          this.popup.setAttribute("noactions", "true");
          this.removeAttribute("actiontype");
        }
        this._pressedNoActionKeys.add(event.keyCode);
      }
    });

    this.addEventListener("keyup", (event) => {
      if (this._noActionKeys.has(event.keyCode) &&
        this._pressedNoActionKeys.has(event.keyCode)) {
        this._pressedNoActionKeys.delete(event.keyCode);
        if (this._pressedNoActionKeys.size == 0)
          this._clearNoActions();
      }
    });

    this.addEventListener("mousedown", (event) => {
      if (event.button == 0) {
        if (event.originalTarget.getAttribute("anonid") == "historydropmarker") {
          this.toggleHistoryPopup();
        }

        // Eventually show the opt-out notification even if the location bar is
        // empty, focused, and the user clicks on it.
        if (this.focused && this.textValue == "") {
          this.maybeShowSearchSuggestionsNotificationOnFocus(true);
        }
      }
    });

    this.addEventListener("focus", (event) => {
      if (event.originalTarget == this.inputField) {
        this._updateUrlTooltip();
        this.formatValue();
        if (this.getAttribute("pageproxystate") != "valid") {
          UpdatePopupNotificationsVisibility();
        }

        // We show the opt-out notification when the mouse/keyboard focus the
        // urlbar, but in any case we want to enforce at least one
        // notification when the user focuses it with the mouse.
        let whichNotification = this.whichSearchSuggestionsNotification;
        if (whichNotification == "opt-out" &&
          this._showSearchSuggestionNotificationOnMouseFocus === undefined) {
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

    this.addEventListener("blur", (event) => {
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

    this.addEventListener("dragstart", (event) => {
      // Drag only if the gesture starts from the input field.
      if (this.inputField != event.originalTarget &&
        !(this.inputField.compareDocumentPosition(event.originalTarget) &
          Node.DOCUMENT_POSITION_CONTAINED_BY))
        return;

      // Drag only if the entire value is selected and it's a valid URI.
      var isFullSelection = this.selectionStart == 0 &&
        this.selectionEnd == this.textLength;
      if (!isFullSelection ||
        this.getAttribute("pageproxystate") != "valid")
        return;

      var urlString = gBrowser.selectedBrowser.currentURI.displaySpec;
      var title = gBrowser.selectedBrowser.contentTitle || urlString;
      var htmlString = "<a href=\"" + urlString + "\">" + urlString + "</a>";

      var dt = event.dataTransfer;
      dt.setData("text/x-moz-url", urlString + "\n" + title);
      dt.setData("text/unicode", urlString);
      dt.setData("text/html", htmlString);

      dt.effectAllowed = "copyLink";
      event.stopPropagation();
    }, true);

    this.addEventListener("dragover", (event) => { this.onDragOver(event, this); }, true);

    this.addEventListener("drop", (event) => { this.onDrop(event, this); }, true);

    this.addEventListener("select", (event) => {
      if (!Cc["@mozilla.org/widget/clipboard;1"]
        .getService(Ci.nsIClipboard)
        .supportsSelectionClipboard())
        return;

      if (!window.windowUtils.isHandlingUserInput)
        return;

      var val = this._getSelectedValueForClipboard();
      if (!val)
        return;

      Cc["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Ci.nsIClipboardHelper)
        .copyStringToClipboard(val, Ci.nsIClipboard.kSelectionClipboard);
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox flex="1" class="urlbar-textbox-container" tooltip="aHTMLTooltip">
        <children includes="image|deck|stack|box"></children>
        <moz-input-box anonid="moz-input-box" class="urlbar-input-box" flex="1">
          <children></children>
          <html:input anonid="scheme" class="urlbar-scheme textbox-input" required="required" inherits="textoverflow,focused"></html:input>
          <html:input anonid="input" class="urlbar-input textbox-input" allowevents="true" inputmode="mozAwesomebar" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,focused,textoverflow"></html:input>
        </moz-input-box>
        <image anonid="urlbar-go-button" class="urlbar-go-button urlbar-icon" onclick="gURLBar.handleCommand(event);" tooltiptext="FROM-DTD.goEndCap.tooltip;" inherits="pageproxystate,parentfocused=focused,usertyping"></image>
        <dropmarker anonid="historydropmarker" class="urlbar-history-dropmarker urlbar-icon chromeclass-toolbar-additional" tooltiptext="FROM-DTD.urlbar.openHistoryPopup.tooltip;" allowevents="true" inherits="open,parentfocused=focused,usertyping"></dropmarker>
        <children includes="hbox"></children>
      </hbox>
      <popupset anonid="popupset" class="autocomplete-result-popupset"></popupset>
      <children includes="toolbarbutton"></children>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    this.ExtensionSearchHandler = (ChromeUtils.import("resource://gre/modules/ExtensionSearchHandler.jsm", {})).ExtensionSearchHandler;

    this.valueFormatter = new UrlbarValueFormatter(this);

    this.goButton = document.getAnonymousElementByAttribute(this, "anonid", "urlbar-go-button");

    this._value = "";

    this.gotResultForCurrentQuery = false;

    /**
     * This is set around HandleHenter so it can be used in handleCommand.
     * It is also used to track whether we must handle a delayed handleEnter,
     * by checking if it has been cleared.
     */
    this.handleEnterInstance = null;

    /**
     * Set by focusAndSelectUrlBar to indicate whether the next focus event was
     * initiated by an explicit user action. See the "focus" handler below.
     */
    this.userInitiatedFocus = false;

    /**
     * The enter key is always deferred, so it's not included here.
     */
    this._keyCodesToDefer = new Set([
      KeyboardEvent.DOM_VK_RETURN,
      KeyboardEvent.DOM_VK_DOWN,
      KeyboardEvent.DOM_VK_TAB,
    ]);

    this._deferredKeyEventQueue = [];

    this._deferredKeyEventTimeout = null;

    this._deferredKeyEventTimeoutMs = 200;

    this._searchStartDate = 0;

    this._mayTrimURLs = true;

    this._copyCutController = {
      urlbar: this,
      doCommand(aCommand) {
        var urlbar = this.urlbar;
        var val = urlbar._getSelectedValueForClipboard();
        if (!val)
          return;

        if (aCommand == "cmd_cut" && this.isCommandEnabled(aCommand)) {
          let start = urlbar.selectionStart;
          let end = urlbar.selectionEnd;
          urlbar.inputField.value = urlbar.inputField.value.substring(0, start) +
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
        return this.supportsCommand(aCommand) &&
          (aCommand != "cmd_cut" || !this.urlbar.readOnly) &&
          this.urlbar.selectionStart < this.urlbar.selectionEnd;
      },
      onEvent(aEventName) {},
    };

    this._pressedNoActionKeys = new Set();

    // UrlbarInput compatibility shims
    this.document = document;
    this.window = window;
    this.textbox = this;

    this._prefs = Cc["@mozilla.org/preferences-service;1"]
      .getService(Ci.nsIPrefService)
      .getBranch("browser.urlbar.");
    this._prefs.addObserver("", this);

    this._defaultPrefs = Cc["@mozilla.org/preferences-service;1"]
      .getService(Ci.nsIPrefService)
      .getDefaultBranch("browser.urlbar.");

    Services.prefs.addObserver("browser.search.suggest.enabled", this);
    this.browserSearchSuggestEnabled = Services.prefs.getBoolPref("browser.search.suggest.enabled");

    this.openInTab = this._prefs.getBoolPref("openintab");
    this.clickSelectsAll = this._prefs.getBoolPref("clickSelectsAll");
    this.doubleClickSelectsAll = this._prefs.getBoolPref("doubleClickSelectsAll");
    this.completeDefaultIndex = this._prefs.getBoolPref("autoFill");
    this.speculativeConnectEnabled = this._prefs.getBoolPref("speculativeConnect.enabled");
    this.urlbarSearchSuggestEnabled = this._prefs.getBoolPref("suggest.searches");
    this.timeout = this._prefs.getIntPref("delay");
    this._mayTrimURLs = this._prefs.getBoolPref("trimURLs");
    this._adoptIntoActiveWindow = this._prefs.getBoolPref("switchTabs.adoptIntoActiveWindow");
    this._ctrlCanonizesURLs = this._prefs.getBoolPref("ctrlCanonizesURLs");
    this.inputField.controllers.insertControllerAt(0, this._copyCutController);
    this.inputField.addEventListener("paste", this);
    this.inputField.addEventListener("mousedown", this);
    this.inputField.addEventListener("mouseover", this);
    this.inputField.addEventListener("overflow", this);
    this.inputField.addEventListener("underflow", this);
    this.inputField.addEventListener("scrollend", this);
    window.addEventListener("resize", this);

    var textBox = document.getAnonymousElementByAttribute(this,
      "anonid", "moz-input-box");
    // Force the Custom Element to upgrade until Bug 1470242 handles this:
    customElements.upgrade(textBox);
    var cxmenu = textBox.menupopup;
    var pasteAndGo;
    cxmenu.addEventListener("popupshowing", function() {
      if (!pasteAndGo)
        return;
      var controller = document.commandDispatcher.getControllerForCommand("cmd_paste");
      var enabled = controller.isCommandEnabled("cmd_paste");
      if (enabled)
        pasteAndGo.removeAttribute("disabled");
      else
        pasteAndGo.setAttribute("disabled", "true");
    });

    var insertLocation = cxmenu.firstElementChild;
    while (insertLocation.nextElementSibling &&
      insertLocation.getAttribute("cmd") != "cmd_paste")
      insertLocation = insertLocation.nextElementSibling;
    if (insertLocation) {
      pasteAndGo = document.createXULElement("menuitem");
      let label = Services.strings.createBundle("chrome://browser/locale/browser.properties").
      GetStringFromName("pasteAndGo.label");
      pasteAndGo.setAttribute("label", label);
      pasteAndGo.setAttribute("anonid", "paste-and-go");
      pasteAndGo.setAttribute("oncommand",
        "gURLBar.select(); goDoCommand('cmd_paste'); gURLBar.handleCommand();");
      cxmenu.insertBefore(pasteAndGo, insertLocation.nextElementSibling);
    }

    this.popup.addEventListener("popupshowing", () => {
      this._enableOrDisableOneOffSearches();
    }, { capture: true, once: true });

    // history dropmarker open state
    this.popup.addEventListener("popupshowing", () => {
      this.setAttribute("open", "true");
    });
    this.popup.addEventListener("popuphidden", () => {
      requestAnimationFrame(() => {
        this.removeAttribute("open");
      });
    });

  }
  /**
   * Since we never want scrollbars, we always use the maxResults value.
   */
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
    return this.handleEnterSearchString ||
      this.mController.searchString ||
      this.textValue;
  }

  get _noActionKeys() {
    if (!this.__noActionKeys) {
      this.__noActionKeys = new Set([
        KeyEvent.DOM_VK_ALT,
        KeyEvent.DOM_VK_SHIFT,
      ]);
      let modifier = AppConstants.platform == "macosx" ?
        KeyEvent.DOM_VK_META :
        KeyEvent.DOM_VK_CONTROL;
      this.__noActionKeys.add(modifier);
    }
    return this.__noActionKeys;
  }

  get _userMadeSearchSuggestionsChoice() {
    return this._prefs.getBoolPref("userMadeSearchSuggestionsChoice") ||
      this._defaultPrefs.getBoolPref("suggest.searches") != this._prefs.getBoolPref("suggest.searches");
  }

  get whichSearchSuggestionsNotification() {
    // Once we return "none" once, we'll always return "none".
    // If available, use the cached value, rather than running all of the
    // checks again at every locationbar focus.
    if (this._whichSearchSuggestionsNotification) {
      return this._whichSearchSuggestionsNotification;
    }

    if (this.browserSearchSuggestEnabled && !this.inPrivateContext &&
      // In any case, if the user made a choice we should not nag him.
      !this._userMadeSearchSuggestionsChoice) {
      if (this._defaultPrefs.getBoolPref("suggest.searches") &&
        this.urlbarSearchSuggestEnabled && // Has not been switched off.
        this._prefs.getIntPref("timesBeforeHidingSuggestionsHint")) {
        return "opt-out";
      }
    }
    return this._whichSearchSuggestionsNotification = "none";
  }

  /**
   * onBeforeValueGet is called by the base-binding's .value getter.
   * It can return an object with a "value" property, to override the
   * return value of the getter.
   */
  onBeforeValueGet() {
    return { value: this._value };
  }

  /**
   * onBeforeValueSet is called by the base-binding's .value setter.
   * It should return the value that the setter should use.
   */
  onBeforeValueSet(aValue) {
    this._value = aValue;
    var returnValue = aValue;
    var action = this._parseActionUrl(aValue);

    if (action) {
      switch (action.type) {
        case "switchtab": // Fall through.
        case "remotetab": // Fall through.
        case "visiturl":
          {
            returnValue = action.params.displayUrl;
            break;
          }
        case "keyword": // Fall through.
        case "searchengine":
          {
            returnValue = action.params.input;
            break;
          }
        case "extension":
          {
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

  onKeyPress(aEvent, aNoDefer) {
    switch (aEvent.keyCode) {
      case KeyEvent.DOM_VK_LEFT:
      case KeyEvent.DOM_VK_RIGHT:
      case KeyEvent.DOM_VK_HOME:
        // Reset the selected index so that nsAutoCompleteController
        // simply closes the popup without trying to fill anything.
        this.popup.selectedIndex = -1;
        break;
      case KeyEvent.DOM_VK_TAB:
        this.userSelectionBehavior = "tab";
        // The user is explicitly making a selection, so the popup
        // should get accessibility focus.
        this.popup.richlistbox.suppressMenuItemEvent = false;
        break;
      case KeyEvent.DOM_VK_UP:
      case KeyEvent.DOM_VK_DOWN:
      case KeyEvent.DOM_VK_PAGE_UP:
      case KeyEvent.DOM_VK_PAGE_DOWN:
        if (this.userSelectionBehavior != "tab")
          this.userSelectionBehavior = "arrow";
        // The user is explicitly making a selection, so the popup
        // should get accessibility focus.
        this.popup.richlistbox.suppressMenuItemEvent = false;
        break;
    }

    if (AppConstants.platform == "macosx") {
      switch (aEvent.key) {
        case "n":
        case "p":
          if (aEvent.ctrlKey) {
            // The user is explicitly making a selection, so the popup
            // should get accessibility focus.
            this.popup.richlistbox.suppressMenuItemEvent = false;
          }
          break;
      }
    }

    if (!this.popup.disableKeyNavigation) {
      if (!aNoDefer && this._shouldDeferKeyEvent(aEvent)) {
        this._deferKeyEvent(aEvent, "onKeyPress");
        return false;
      }
      if (this.popup.popupOpen && this.popup.handleKeyPress(aEvent)) {
        return true;
      }
    }
    return this.handleKeyPress(aEvent);
  }

  /**
   * Search results arrive asynchronously, which means that keypresses may
   * arrive before results do and therefore not have the effect the user
   * intends.  That's especially likely to happen with the down arrow and
   * enter keys due to the one-off search buttons: if the user very quickly
   * pastes something in the input, presses the down arrow key, and then hits
   * enter, they are probably expecting to visit the first result.  But if
   * there are no results, then pressing down and enter will trigger the
   * first one-off button.  To prevent that undesirable behavior, certain
   * keys are buffered and deferred until more results arrive, at which time
   * they're replayed.
   *
   * @param  event
   * The key event that should maybe be deferred.
   * @return True if the event should be deferred, false if not.
   */
  _shouldDeferKeyEvent(event) {
    // If any event has been deferred for this search, then defer all
    // subsequent events so that the user does not experience any
    // keypresses out of order.  All events will be replayed when
    // _deferredKeyEventTimeout fires.
    if (this._deferredKeyEventQueue.length) {
      return true;
    }

    // At this point, no events have been deferred for this search, and we
    // need to decide whether `event` is the first one that should be.
    if (!this._keyCodesToDefer.has(event.keyCode) &&
      !(/Mac/.test(navigator.platform) &&
        event.ctrlKey &&
        (event.key === "n" || event.key === "p") &&
        this.popupOpen)) {

      // Not a key that should trigger deferring.
      return false;
    }

    let waitedLongEnough =
      this._searchStartDate + this._deferredKeyEventTimeoutMs <= Cu.now();
    if (waitedLongEnough) {
      // This is a key that we would defer, but enough time has passed
      // since the start of the search that we don't want to block the
      // user's keypresses anymore.
      return false;
    }

    if (event.keyCode == KeyEvent.DOM_VK_TAB && !this.popupOpen) {
      // The popup is closed and the user pressed the Tab key.  The
      // focus should move out of the urlbar immediately.
      return false;
    }

    return !this._safeToPlayDeferredKeyEvent(event);
  }

  /**
   * Returns true if the given deferred key event can be played now without
   * possibly surprising the user.  This depends on the state of the popup,
   * its results, and the type of keypress.  Use this method only after
   * determining that the event should be deferred, or after it's already
   * been deferred and you want to know if it can be played now.
   *
   * @param  event
   * The key event.
   * @return True if the event can be played, false if not.
   */
  _safeToPlayDeferredKeyEvent(event) {
    if (event.keyCode == KeyEvent.DOM_VK_RETURN) {
      return this.popup.selectedIndex != 0 ||
        this.gotResultForCurrentQuery;
    }

    if (!this.gotResultForCurrentQuery || !this.popupOpen) {
      // We're still waiting on the first result, or the popup hasn't
      // opened yet, so not safe.
      return false;
    }

    let maxResultsRemaining =
      this.popup.maxResults - this.popup.matchCount;
    if (maxResultsRemaining == 0) {
      // The popup can't possibly have any more results, so there's no
      // need to defer any event now.
      return true;
    }

    if (event.keyCode == KeyEvent.DOM_VK_DOWN) {
      // Don't play the event if the last result is selected so that the
      // user doesn't accidentally arrow down into the one-off buttons
      // when they didn't mean to.
      let lastResultSelected =
        this.popup.selectedIndex + 1 == this.popup.matchCount;
      return !lastResultSelected;
    }

    return true;
  }

  /**
   * Adds a key event to the deferred event queue.
   *
   * @param event
   * The key event to defer.
   * @param methodName
   * The name of the method on `this` to call.  It's expected to take
   * two arguments: the event, and a noDefer bool.  If the bool is
   * true, then the event is being replayed and it should not be
   * deferred.
   */
  _deferKeyEvent(event, methodName) {
    // Somehow event.defaultPrevented ends up true for deferred events.
    // autocomplete ignores defaultPrevented events, which means it would
    // ignore replayed deferred events if we didn't tell it to bypass
    // defaultPrevented.  That's the purpose of this expando.  If we could
    // figure out what's setting defaultPrevented and prevent it, then we
    // could get rid of this.
    if (event.urlbarDeferred) {
      throw new Error("Key event already deferred!");
    }
    event.urlbarDeferred = true;

    this._deferredKeyEventQueue.push({
      methodName,
      event,
      searchString: this.mController.searchString,
    });

    if (!this._deferredKeyEventTimeout) {
      // Start the timeout that will unconditionally replay all deferred
      // events when it fires so that, after a certain point, we don't
      // keep blocking the user's keypresses when nothing else has caused
      // the events to be replayed.  Do not check whether it's safe to
      // replay the events because otherwise it may look like we ignored
      // the user's input.
      let elapsed = Cu.now() - this._searchStartDate;
      let remaining = this._deferredKeyEventTimeoutMs - elapsed;
      this._deferredKeyEventTimeout = setTimeout(() => {
        this.replayAllDeferredKeyEvents();
        this._deferredKeyEventTimeout = null;
      }, Math.max(0, remaining));
    }
  }

  replaySafeDeferredKeyEvents() {
    if (!this._deferredKeyEventQueue.length) {
      return;
    }
    let instance = this._deferredKeyEventQueue[0];
    if (!this._safeToPlayDeferredKeyEvent(instance.event)) {
      return;
    }
    this._deferredKeyEventQueue.shift();
    this._replayKeyEventInstance(instance);
    Services.tm.dispatchToMainThread(() => {
      this.replaySafeDeferredKeyEvents();
    });
  }

  /**
   * Unconditionally replays all deferred key events.  This does not check
   * whether it's safe to replay the events; use replaySafeDeferredKeyEvents
   * for that.  Use this method when you must replay all events so that it
   * does not appear that we ignored the user's input.
   */
  replayAllDeferredKeyEvents() {
    let instance = this._deferredKeyEventQueue.shift();
    if (!instance) {
      return;
    }
    this._replayKeyEventInstance(instance);
    Services.tm.dispatchToMainThread(() => {
      this.replayAllDeferredKeyEvents();
    });
  }

  _replayKeyEventInstance(instance) {
    // Safety check: handle only if the search string didn't change.
    if (this.mController.searchString == instance.searchString) {
      this[instance.methodName](instance.event, true);
    }
  }

  trimValue(aURL) {
    // This method must not modify the given URL such that calling
    // nsIURIFixup::createFixupURI with the result will produce a different URI.
    return this._mayTrimURLs ? trimURL(aURL) : aURL;
  }

  /**
   * This method tries to apply styling to the text in the input, depending
   * on the text.  See the _format* methods.
   */
  formatValue() {
    this.valueFormatter.update();
  }

  handleRevert() {
    var isScrolling = this.popupOpen;

    gBrowser.userTypedValue = null;

    // don't revert to last valid url unless page is NOT loading
    // and user is NOT key-scrolling through autocomplete list
    if (!XULBrowserWindow.isBusy && !isScrolling) {
      URLBarSetURI(null, true);

      // If the value isn't empty and the urlbar has focus, select the value.
      if (this.value && this.hasAttribute("focused"))
        this.select();
    }

    // tell widget to revert to last typed text only if the user
    // was scrolling when they hit escape
    return !isScrolling;
  }

  _whereToOpen(event) {
    let isMouseEvent = event instanceof MouseEvent;
    let reuseEmpty = !isMouseEvent;
    let where = undefined;
    if (!isMouseEvent && event && event.altKey) {
      // We support using 'alt' to open in a tab, because ctrl/shift
      // might be used for canonizing URLs:
      where = event.shiftKey ? "tabshifted" : "tab";
    } else if (!isMouseEvent && this._ctrlCanonizesURLs && event && event.ctrlKey) {
      // If we're allowing canonization, and this is a key event with ctrl
      // pressed, open in current tab to allow ctrl-enter to canonize URL.
      where = "current";
    } else {
      where = whereToOpenLink(event, false, false);
    }
    if (this.openInTab) {
      if (where == "current") {
        where = "tab";
      } else if (where == "tab") {
        where = "current";
      }
      reuseEmpty = true;
    }
    if (where == "tab" && reuseEmpty && gBrowser.selectedTab.isEmpty) {
      where = "current";
    }
    return where;
  }

  /**
   * This is ultimately called by the autocomplete controller as the result
   * of handleEnter when the Return key is pressed in the textbox.  Since
   * onPopupClick also calls handleEnter, this is also called as a result in
   * that case.
   *
   * @param event
   * The event that triggered the command.
   * @param openUILinkWhere
   * Optional.  The "where" to pass to openTrustedLinkIn.  This method
   * computes the appropriate "where" given the event, but you can
   * use this to override it.
   * @param openUILinkParams
   * Optional.  The parameters to pass to openTrustedLinkIn.  As with
   * "where", this method computes the appropriate parameters, but
   * any parameters you supply here will override those.
   */
  handleCommand(event, openUILinkWhere, openUILinkParams, triggeringPrincipal) {
    let isMouseEvent = event instanceof MouseEvent;
    if (isMouseEvent && event.button == 2) {
      // Do nothing for right clicks.
      return;
    }

    // Determine whether to use the selected one-off search button.  In
    // one-off search buttons parlance, "selected" means that the button
    // has been navigated to via the keyboard.  So we want to use it if
    // the triggering event is not a mouse click -- i.e., it's a Return
    // key -- or if the one-off was mouse-clicked.
    let selectedOneOff = this.popup.oneOffSearchButtons.selectedButton;
    if (selectedOneOff &&
      isMouseEvent &&
      event.originalTarget != selectedOneOff) {
      selectedOneOff = null;
    }

    // Do the command of the selected one-off if it's not an engine.
    if (selectedOneOff && !selectedOneOff.engine) {
      selectedOneOff.doCommand();
      return;
    }

    let where = openUILinkWhere || this._whereToOpen(event);

    let url = this.value;
    if (!url) {
      return;
    }

    BrowserUsageTelemetry.recordUrlbarSelectedResultMethod(
      event, this.userSelectionBehavior);

    let mayInheritPrincipal = false;
    let postData = null;
    let browser = gBrowser.selectedBrowser;
    let action = this._parseActionUrl(url);

    if (selectedOneOff && selectedOneOff.engine) {
      // If there's a selected one-off button then load a search using
      // the one-off's engine.
      [url, postData] =
      this._parseAndRecordSearchEngineLoad(selectedOneOff.engine,
        this.oneOffSearchQuery,
        event, where,
        openUILinkParams);
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
            postData = UrlbarUtils.getPostDataStream(action.params.postData);
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
              adoptIntoActiveWindow: this._adoptIntoActiveWindow,
            };

            if (switchToTabHavingURI(url, false, loadOpts) &&
              prevTab.isEmpty) {
              gBrowser.removeTab(prevTab);
            }
            return;
          }

          // Once we get here, we got a switchtab action but the user
          // bypassed it by pressing shift/meta/ctrl. Those modifiers
          // might otherwise affect where we open - we always want to
          // open in the current tab.
          where = "current";
          break;
        case "searchengine":
          if (selectedOneOff && selectedOneOff.engine) {
            // Replace the engine with the selected one-off engine.
            action.params.engineName = selectedOneOff.engine.name;
          }
          // If the selected result is an @alias offer -- an @alias with
          // an empty query string -- then instead of loading the engine's
          // empty search results page, put the @alias in the input so
          // that the user can type a search query and search directly
          // from the urlbar.
          if (action.params.alias &&
            action.params.alias.startsWith("@") &&
            !action.params.searchQuery) {
            this.search(action.params.input);
            return;
          }
          const actionDetails = {
            isSuggestion: !!action.params.searchSuggestion,
            alias: action.params.alias,
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
          this.ExtensionSearchHandler.handleInputEntered(keyword, searchString, where);
          return;
      }
    } else {
      // This is a fallback for add-ons and old testing code that directly
      // set value and try to confirm it. UnifiedComplete should always
      // resolve to a valid url.
      try {
        url = url.trim();
        new URL(url);
      } catch (ex) {
        let lastLocationChange = browser.lastLocationChange;
        UrlbarUtils.getShortcutOrURIAndPostData(url).then(data => {
          if (where != "current" ||
            browser.lastLocationChange == lastLocationChange) {
            this._loadURL(data.url, browser, data.postData, where,
              openUILinkParams, data.mayInheritPrincipal,
              triggeringPrincipal);
          }
        });
        return;
      }
    }

    this._loadURL(url, browser, postData, where, openUILinkParams,
      mayInheritPrincipal, triggeringPrincipal);
  }

  _loadURL(url, browser, postData, openUILinkWhere, openUILinkParams, mayInheritPrincipal, triggeringPrincipal) {
    this.value = url;
    browser.userTypedValue = url;
    if (gInitialPages.includes(url)) {
      browser.initialPageLoadedFromURLBar = url;
    }
    try {
      UrlbarUtils.addToUrlbarHistory(url, window);
    } catch (ex) {
      // Things may go wrong when adding url to session history,
      // but don't let that interfere with the loading of the url.
      Cu.reportError(ex);
    }

    let params = {
      postData,
      allowThirdPartyFixup: true,
      triggeringPrincipal,
    };
    if (openUILinkWhere == "current") {
      params.targetBrowser = browser;
      params.indicateErrorPageLoad = true;
      params.allowPinnedTabHostChange = true;
      params.allowPopups = url.startsWith("javascript:");
    } else {
      params.initiatingDoc = document;
    }
    params.allowInheritPrincipal = mayInheritPrincipal;

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
      openTrustedLinkIn(url, openUILinkWhere, params);
    } catch (ex) {
      // This load can throw an exception in certain cases, which means
      // we'll want to replace the URL with the loaded URL:
      if (ex.result != Cr.NS_ERROR_LOAD_SHOWED_ERRORPAGE) {
        this.handleRevert();
      }
    }

    // Ensure the start of the URL is visible for usability reasons.
    this.selectionStart = this.selectionEnd = 0;
  }

  _parseAndRecordSearchEngineLoad(engineOrEngineName, query, event, openUILinkWhere, openUILinkParams, searchActionDetails) {
    let engine =
      typeof(engineOrEngineName) == "string" ?
      Services.search.getEngineByName(engineOrEngineName) :
      engineOrEngineName;
    let isOneOff = this.popup.oneOffSearchButtons
      .maybeRecordTelemetry(event, openUILinkWhere, openUILinkParams);
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
    if (!/^\s*[^.:\/\s]+(?:\/.*|\s*)$/i.test(aUrl) ||
      !this._ctrlCanonizesURLs ||
      !(aTriggeringEvent instanceof KeyboardEvent) ||
      !aTriggeringEvent.ctrlKey) {
      return;
    }

    let suffix = Services.prefs.getCharPref("browser.fixup.alternate.suffix", ".com/");
    if (!suffix.endsWith("/")) {
      suffix += "/";
    }

    // trim leading/trailing spaces (bug 233205)
    let url = aUrl.trim();

    // Tack www. and suffix on.  If user has appended directories, insert
    // suffix before them (bug 279035).  Be careful not to get two slashes.
    let firstSlash = url.indexOf("/");
    if (firstSlash >= 0) {
      url = url.substring(0, firstSlash) + suffix +
        url.substring(firstSlash + 1);
    } else {
      url = url + suffix;
    }

    this.popup.overrideValue = "http://www." + url;
  }

  _updateUrlTooltip() {
    if (this.focused || !this._inOverflow) {
      this.inputField.removeAttribute("title");
    } else {
      this.inputField.setAttribute("title", this.value);
    }
  }

  /**
   * Returns:
   * null if there's a security issue and we should do nothing.
   * a URL object if there is one that we're OK with loading,
   * a text value otherwise.
   */
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
      let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(aEvent);
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
          urlSecurityCheck(url,
            triggeringPrincipal,
            Ci.nsIScriptSecurityManager.DISALLOW_INHERIT_PRINCIPAL);
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
      let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(aEvent);
      this.value = droppedItem instanceof URL ? droppedItem.href : droppedItem;
      SetPageProxyState("invalid");
      this.focus();
      this.handleCommand(null, undefined, undefined, triggeringPrincipal);
      // Force not showing the dropped URI immediately.
      gBrowser.userTypedValue = null;
      URLBarSetURI(null, true);
    }
  }

  makeURIReadable(aURI) {
    // Avoid copying 'about:reader?url=', and always provide the original URI:
    // Reader mode ensures we call createExposableURI itself.
    let readerStrippedURI = ReaderMode.getOriginalUrlObjectForDisplay(aURI.displaySpec);
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
    // Grab the actual input field's value, not our value, which could
    // include "moz-action:".
    var inputVal = this.inputField.value;
    let selection = this.editor.selection;
    const flags = Ci.nsIDocumentEncoder.OutputPreformatted |
      Ci.nsIDocumentEncoder.OutputRaw;
    let selectedVal = selection.toStringWithFormat("text/plain", flags, 0);

    // Handle multiple-range selection as a string for simplicity.
    if (selection.rangeCount > 1) {
      return selectedVal;
    }

    // If the selection doesn't start at the beginning or doesn't span the
    // full domain or the URL bar is modified or there is no text at all,
    // nothing else to do here.
    if (this.selectionStart > 0 || this.valueIsTyped || selectedVal == "")
      return selectedVal;
    // The selection doesn't span the full domain if it doesn't contain a slash and is
    // followed by some character other than a slash.
    if (!selectedVal.includes("/")) {
      let remainder = inputVal.replace(selectedVal, "");
      if (remainder != "" && remainder[0] != "/")
        return selectedVal;
    }

    // If the value was filled by a search suggestion, just return it.
    let action = this._parseActionUrl(this.value);
    if (action && action.type == "searchengine")
      return selectedVal;

    let uriFixup = Cc["@mozilla.org/docshell/urifixup;1"].getService(Ci.nsIURIFixup);

    let uri;
    if (this.getAttribute("pageproxystate") == "valid") {
      uri = gBrowser.currentURI;
    } else {
      // We're dealing with an autocompleted value, create a new URI from that.
      try {
        uri = uriFixup.createFixupURI(inputVal, Ci.nsIURIFixup.FIXUP_FLAG_NONE);
      } catch (e) {}
      if (!uri)
        return selectedVal;
    }

    uri = this.makeURIReadable(uri);

    // If the entire URL is selected, just use the actual loaded URI,
    // unless we want a decoded URI, or it's a data: or javascript: URI,
    // since those are hard to read when encoded.
    if (inputVal == selectedVal &&
      !uri.schemeIs("javascript") && !uri.schemeIs("data") &&
      !Services.prefs.getBoolPref("browser.urlbar.decodeURLsOnCopy")) {
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
        case "ctrlCanonizesURLs":
          this._ctrlCanonizesURLs = this._prefs.getBoolPref(aData);
          break;
        case "speculativeConnect.enabled":
          this.speculativeConnectEnabled = this._prefs.getBoolPref(aData);
          break;
        case "openintab":
          this.openInTab = this._prefs.getBoolPref(aData);
          break;
        case "browser.search.suggest.enabled":
          this.browserSearchSuggestEnabled = Services.prefs.getBoolPref(aData);
          break;
        case "suggest.searches":
          this.urlbarSearchSuggestEnabled = this._prefs.getBoolPref(aData);
        case "userMadeSearchSuggestionsChoice":
          // Mirror the value for future use, see the comment in the
          // binding's constructor.
          this._prefs.setBoolPref("searchSuggestionsChoice",
            this.urlbarSearchSuggestEnabled);
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
          this._adoptIntoActiveWindow =
            this._prefs.getBoolPref("switchTabs.adoptIntoActiveWindow");
          break;
      }
    }
  }

  _enableOrDisableOneOffSearches() {
    this.popup.toggleOneOffSearches(
      this._prefs.getBoolPref("oneOffSearches"),
      "pref"
    );
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
        if (this.doubleClickSelectsAll &&
          aEvent.button == 0 && aEvent.detail == 2) {
          this.editor.selectAll();
          aEvent.preventDefault();
        }
        break;
      case "mouseover":
        this._updateUrlTooltip();
        break;
      case "overflow":
        {
          const targetIsPlaceholder = !aEvent.originalTarget.classList.contains("anonymous-div");
          // We only care about the non-placeholder text.
          // This shouldn't be needed, see bug 1487036.
          if (targetIsPlaceholder) {
            break;
          }
          this._inOverflow = true;
          this.updateTextOverflow();
          break;
        }
      case "underflow":
        {
          const targetIsPlaceholder = !aEvent.originalTarget.classList.contains("anonymous-div");
          // We only care about the non-placeholder text.
          // This shouldn't be needed, see bug 1487036.
          if (targetIsPlaceholder) {
            break;
          }
          this._inOverflow = false;
          this.updateTextOverflow();
          this._updateUrlTooltip();
          break;
        }
      case "scrollend":
        this.updateTextOverflow();
        break;
      case "TabSelect":
        // The autocomplete controller uses heuristic on some internal caches
        // to handle cases like backspace, autofill or repeated searches.
        // Ensure to clear those internal caches when switching tabs.
        this.controller.resetInternalState();
        break;
      case "resize":
        if (aEvent.target == window) {
          // Close the popup since it would be wrongly sized, we'll
          // recalculate a proper size on reopening. For example, this may
          // happen when using special OS resize functions like Win+Arrow.
          this.closePopup();

          // Make sure the host remains visible in the input field
          // when the window is resized.  We don't want to
          // hurt resize performance though, so do this only after resize
          // events have stopped and a small timeout has elapsed.
          if (this._resizeThrottleTimeout) {
            clearTimeout(this._resizeThrottleTimeout);
          }
          this._resizeThrottleTimeout = setTimeout(() => {
            this._resizeThrottleTimeout = null;
            this.valueFormatter.ensureFormattedHostVisible();
          }, 100);
        }
        break;
    }
  }

  updateTextOverflow() {
    if (this._inOverflow) {
      window.promiseDocumentFlushed(() => {
        // Check overflow again to ensure it didn't change in the meanwhile.
        let input = this.inputField;
        if (input && this._inOverflow) {
          let side = input.scrollLeft &&
            input.scrollLeft == input.scrollLeftMax ? "start" : "end";
          this.setAttribute("textoverflow", side);
        }
      });
    } else {
      this.removeAttribute("textoverflow");
    }
  }

  /**
   * onBeforeTextValueGet is called by the base-binding's .textValue getter.
   * It should return the value that the getter should use.
   */
  onBeforeTextValueGet() {
    return { value: this.inputField.value };
  }

  /**
   * onBeforeTextValueSet is called by the base-binding's .textValue setter.
   * It should return the value that the setter should use.
   */
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
    if (!MOZ_ACTION_REGEX.test(aUrl))
      return null;

    // URL is in the format moz-action:ACTION,PARAMS
    // Where PARAMS is a JSON encoded object.
    let [, type, params] = aUrl.match(MOZ_ACTION_REGEX);

    let action = {
      type,
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
    if (action)
      this.setAttribute("actiontype", action.type);
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
      // If the popup already had accessibility focus, bring it back to
      // the input, since the user is editing.
      if (!this.popup.richlistbox.suppressMenuItemEvent &&
        this.popup.richlistbox.currentItem) {
        this.popup.richlistbox.currentItem._fireEvent("DOMMenuItemInactive");
      }
      // The user is typing, so don't give accessibility focus to the
      // popup, even if an item gets automatically selected.
      this.popup.richlistbox.suppressMenuItemEvent = true;
      // Only wait for a result when we are sure to get one.  In some
      // cases, like when pasting the same exact text, we may not fire
      // a new search and we won't get a result.
      this._onInputHandledText = this.mController.handleText();
      if (this._onInputHandledText) {
        this.gotResultForCurrentQuery = false;
        this._searchStartDate = Cu.now();
        this._deferredKeyEventQueue = [];
        if (this._deferredKeyEventTimeout) {
          clearTimeout(this._deferredKeyEventTimeout);
          this._deferredKeyEventTimeout = null;
        }
      }
    }
    this.resetActionType();
  }

  handleEnter(event, noDefer) {
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

    if (!noDefer && this._shouldDeferKeyEvent(event)) {
      // Defer the event until the first non-heuristic result comes in.
      this._deferKeyEvent(event, "handleEnter");
      return false;
    }

    let canonizeValue = this.value;
    if (event.ctrlKey) {
      let action = this._parseActionUrl(canonizeValue);
      if (action && "searchSuggestion" in action.params) {
        canonizeValue = action.params.searchSuggestion;
      } else if (this.popup.selectedIndex === 0 &&
        this.mController.getStyleAt(0).includes("autofill")) {
        canonizeValue = this.handleEnterSearchString;
      }
    }
    this.maybeCanonizeURL(event, canonizeValue);
    let handled = this.mController.handleEnter(false, event);
    this.handleEnterSearchString = null;
    this.popup.overrideValue = null;
    return handled;
  }

  handleDelete() {
    // If the heuristic result is selected, then the autocomplete
    // controller's handleDelete implementation will remove it, which is
    // not what we want.  So in that case, call handleText so it acts as
    // a backspace on the text value instead of removing the result.
    if (this.popup.selectedIndex == 0 &&
      this.popup._isFirstResultHeuristic) {
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
    if (this._showSearchSuggestionNotificationOnMouseFocus &&
      mouseFocused) {
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

  /**
   * Sets the input's value, starts a search, and opens the popup.
   *
   * @param  value
   * The input's value will be set to this value, and the search will
   * use it as its query.
   */
  search(value) {
    // Hide the suggestions notification if the search uses an "@engine"
    // search engine alias.
    if (value.trim()[0] == "@") {
      let which = this.whichSearchSuggestionsNotification;
      this._whichSearchSuggestionsNotification = "none";
      this.popup.addEventListener("popuphidden", () => {
        this._whichSearchSuggestionsNotification = which;
      }, { once: true });
    }

    // We want the value to be treated as text that the user typed.  It
    // should go through the controller.handleText() path in onInput() so
    // that gBrowser.userTypedValue, this.valueIsTyped, etc. are set and
    // nsAutoCompleteController::HandleText() is called.  Set this.value
    // and fire an input event to do that.  (If we set this.textValue we'd
    // get an input event for free, but it would also set mIgnoreInput,
    // skipping all of the above requirements.)
    this.focus();
    this.value = value;

    // Avoid selecting the text if this method is called twice in a row.
    this.selectionStart = -1;

    let event = document.createEvent("Events");
    event.initEvent("input", true, true);
    this.dispatchEvent(event);

    // handleText() ignores the value if it's the same as the previous
    // value, but we want consecutive searches with the same value to be
    // possible.  If handleText() returned false, then manually start a
    // new search here.
    if (!this._onInputHandledText) {
      this.gotResultForCurrentQuery = false;
      this.controller.startSearch(value);
    }
  }

  typeRestrictToken(char) {
    for (let c of [char, " "]) {
      let code = c.charCodeAt(0);
      gURLBar.inputField.dispatchEvent(new KeyboardEvent("keypress", {
        keyCode: code,
        charCode: code,
        bubbles: true,
      }));
    }
  }
  disconnectedCallback() {
    // Somehow, it's possible for the XBL destructor to fire without the
    // constructor ever having fired. Fix:
    if (!this._prefs) {
      return;
    }
    this._prefs.removeObserver("", this);
    this._prefs = null;
    Services.prefs.removeObserver("browser.search.suggest.enabled", this);
    this.inputField.controllers.removeController(this._copyCutController);
    this.inputField.removeEventListener("paste", this);
    this.inputField.removeEventListener("mousedown", this);
    this.inputField.removeEventListener("mouseover", this);
    this.inputField.removeEventListener("overflow", this);
    this.inputField.removeEventListener("underflow", this);
    this.inputField.removeEventListener("scrollend", this);
    window.removeEventListener("resize", this);

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
}

MozXULElement.implementCustomInterface(MozLegacyUrlbar, [Ci.nsIObserver]);
customElements.define("legacy-urlbar", MozLegacyUrlbar);

}
