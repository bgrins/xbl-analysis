class SearchbarTextbox extends Autocomplete {
  connectedCallback() {
    super.connectedCallback()

    /**
     * nsIController
     */
    this.searchbarController = {
      _self: this,
      supportsCommand(aCommand) {
        return aCommand == "cmd_clearhistory" ||
          aCommand == "cmd_togglesuggest";
      },

      isCommandEnabled(aCommand) {
        return true;
      },

      doCommand(aCommand) {
        switch (aCommand) {
          case "cmd_clearhistory":
            var param = this._self.getAttribute("autocompletesearchparam");

            BrowserSearch.searchBar.FormHistory.update({ op: "remove", fieldname: param }, null);
            this._self.value = "";
            break;
          case "cmd_togglesuggest":
            let enabled =
              Services.prefs.getBoolPref("browser.search.suggest.enabled");
            Services.prefs.setBoolPref("browser.search.suggest.enabled", !enabled);
            break;
          default:
            // do nothing with unrecognized command
        }
      }
    };

    if (document.getBindingParent(this).parentNode.parentNode.localName ==
      "toolbarpaletteitem")
      return;

    if (Services.prefs.getBoolPref("browser.urlbar.clickSelectsAll"))
      this.setAttribute("clickSelectsAll", true);

    var textBox = document.getAnonymousElementByAttribute(this,
      "anonid", "moz-input-box");

    // Force the Custom Element to upgrade until Bug 1470242 handles this:
    customElements.upgrade(textBox);
    var cxmenu = textBox.menupopup;
    cxmenu.addEventListener("popupshowing",
      () => { this.initContextMenu(cxmenu); }, { capture: true, once: true });

    this.setAttribute("aria-owns", this.popup.id);
    document.getBindingParent(this)._textboxInitialized = true;

    this._setupEventListeners();
  }
  /**
   * This overrides the searchParam property in autocomplete.xml.  We're
   * hijacking this property as a vehicle for delivering the privacy
   * information about the window into the guts of nsSearchSuggestions.
   *
   * Note that the setter is the same as the parent.  We were not sure whether
   * we can override just the getter.  If that proves to be the case, the setter
   * can be removed.
   */
  set searchParam(val) {
    this.setAttribute('autocompletesearchparam', val);
    return val;
  }

  get searchParam() {
    return this.getAttribute('autocompletesearchparam') +
      (PrivateBrowsingUtils.isWindowPrivate(window) ? '|private' : '');
  }

  set selectedButton(val) {
    return this.popup.oneOffButtons.selectedButton = val;
  }

  get selectedButton() {
    return this.popup.oneOffButtons.selectedButton;
  }

  initContextMenu(aMenu) {
    const kXULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    let stringBundle = document.getBindingParent(this)._stringBundle;

    let pasteAndSearch, suggestMenuItem;
    let element, label, akey;

    element = document.createElementNS(kXULNS, "menuseparator");
    aMenu.appendChild(element);

    let insertLocation = aMenu.firstElementChild;
    while (insertLocation.nextElementSibling &&
      insertLocation.getAttribute("cmd") != "cmd_paste")
      insertLocation = insertLocation.nextElementSibling;
    if (insertLocation) {
      element = document.createElementNS(kXULNS, "menuitem");
      label = stringBundle.getString("cmd_pasteAndSearch");
      element.setAttribute("label", label);
      element.setAttribute("anonid", "paste-and-search");
      element.setAttribute("oncommand", "BrowserSearch.pasteAndSearch(event)");
      aMenu.insertBefore(element, insertLocation.nextElementSibling);
      pasteAndSearch = element;
    }

    element = document.createElementNS(kXULNS, "menuitem");
    label = stringBundle.getString("cmd_clearHistory");
    akey = stringBundle.getString("cmd_clearHistory_accesskey");
    element.setAttribute("label", label);
    element.setAttribute("accesskey", akey);
    element.setAttribute("cmd", "cmd_clearhistory");
    aMenu.appendChild(element);

    element = document.createElementNS(kXULNS, "menuitem");
    label = stringBundle.getString("cmd_showSuggestions");
    akey = stringBundle.getString("cmd_showSuggestions_accesskey");
    element.setAttribute("anonid", "toggle-suggest-item");
    element.setAttribute("label", label);
    element.setAttribute("accesskey", akey);
    element.setAttribute("cmd", "cmd_togglesuggest");
    element.setAttribute("type", "checkbox");
    element.setAttribute("autocheck", "false");
    suggestMenuItem = element;
    aMenu.appendChild(element);

    if (AppConstants.platform == "macosx") {
      this.addEventListener("keypress", aEvent => {
        if (aEvent.keyCode == KeyEvent.DOM_VK_F4)
          this.openSearch();
      }, true);
    }

    this.controllers.appendController(this.searchbarController);

    let onpopupshowing = function() {
      BrowserSearch.searchBar._textbox.closePopup();
      if (suggestMenuItem) {
        let enabled =
          Services.prefs.getBoolPref("browser.search.suggest.enabled");
        suggestMenuItem.setAttribute("checked", enabled);
      }

      if (!pasteAndSearch)
        return;
      let controller = document.commandDispatcher.getControllerForCommand("cmd_paste");
      let enabled = controller.isCommandEnabled("cmd_paste");
      if (enabled)
        pasteAndSearch.removeAttribute("disabled");
      else
        pasteAndSearch.setAttribute("disabled", "true");
    };
    aMenu.addEventListener("popupshowing", onpopupshowing);
    onpopupshowing();
  }

  /**
   * This is implemented so that when textbox.value is set directly (e.g.,
   * by tests), the one-off query is updated.
   */
  onBeforeValueSet(aValue) {
    this.popup.oneOffButtons.query = aValue;
    return aValue;
  }

  /**
   * This method overrides the autocomplete binding's openPopup (essentially
   * duplicating the logic from the autocomplete popup binding's
   * openAutocompletePopup method), modifying it so that the popup is aligned with
   * the inner textbox, but sized to not extend beyond the search bar border.
   */
  openPopup() {
    // Entering customization mode after the search bar had focus causes
    // the popup to appear again, due to focus returning after the
    // hamburger panel closes. Don't open in that spurious event.
    if (document.documentElement.getAttribute("customizing") == "true") {
      return;
    }

    var popup = this.popup;
    if (!popup.mPopupOpen) {
      // Initially the panel used for the searchbar (PopupSearchAutoComplete
      // in browser.xul) is hidden to avoid impacting startup / new
      // window performance. The base binding's openPopup would normally
      // call the overriden openAutocompletePopup in
      // browser-search-autocomplete-result-popup binding to unhide the popup,
      // but since we're overriding openPopup we need to unhide the panel
      // ourselves.
      popup.hidden = false;

      // Don't roll up on mouse click in the anchor for the search UI.
      if (popup.id == "PopupSearchAutoComplete") {
        popup.setAttribute("norolluponanchor", "true");
      }

      popup.mInput = this;
      // clear any previous selection, see bugs 400671 and 488357
      popup.selectedIndex = -1;

      document.popupNode = null;

      const isRTL = getComputedStyle(this, "").direction == "rtl";

      var outerRect = this.getBoundingClientRect();
      var innerRect = this.inputField.getBoundingClientRect();
      let width = isRTL ?
        innerRect.right - outerRect.left :
        outerRect.right - innerRect.left;
      popup.setAttribute("width", width > 100 ? width : 100);

      // invalidate() depends on the width attribute
      popup._invalidate();

      var yOffset = outerRect.bottom - innerRect.bottom;
      popup.openPopup(this.inputField, "after_start", 0, yOffset, false, false);
    }
  }

  openSearch() {
    if (!this.popupOpen) {
      document.getBindingParent(this).openSuggestionsPanel();
      return false;
    }
    return true;
  }

  handleEnter(event) {
    // Toggle the open state of the add-engine menu button if it's
    // selected.  We're using handleEnter for this instead of listening
    // for the command event because a command event isn't fired.
    if (this.selectedButton &&
      this.selectedButton.getAttribute("anonid") ==
      "addengine-menu-button") {
      this.selectedButton.open = !this.selectedButton.open;
      return true;
    }
    // Otherwise, "call super": do what the autocomplete binding's
    // handleEnter implementation does.
    return this.mController.handleEnter(false, event || null);
  }

  /**
   * override |onTextEntered| in autocomplete.xml
   */
  onTextEntered(aEvent) {
    let engine;
    let oneOff = this.selectedButton;
    if (oneOff) {
      if (!oneOff.engine) {
        oneOff.doCommand();
        return;
      }
      engine = oneOff.engine;
    }
    if (this._selectionDetails) {
      BrowserSearch.searchBar.telemetrySearchDetails = this._selectionDetails;
      this._selectionDetails = null;
    }
    document.getBindingParent(this).handleSearchCommand(aEvent, engine);
  }

  handleKeyboardNavigation(aEvent) {
    let popup = this.popup;
    if (!popup.popupOpen)
      return;

    // accel + up/down changes the default engine and shouldn't affect
    // the selection on the one-off buttons.
    if (aEvent.getModifierState("Accel"))
      return;

    let suggestionsHidden =
      popup.richlistbox.getAttribute("collapsed") == "true";
    let numItems = suggestionsHidden ? 0 : this.popup.matchCount;
    this.popup.oneOffButtons.handleKeyPress(aEvent, numItems, true);
  }

  disconnectedCallback() {
    // If the context menu has never been opened, there won't be anything
    // to remove here.
    // Also, XBL and the customize toolbar code sometimes interact poorly.
    try {
      this.controllers.removeController(this.searchbarController);
    } catch (ex) {}
  }

  _setupEventListeners() {
    this.addEventListener("input", (event) => {
      this.popup.removeAttribute("showonlysettings");
    });

    this.addEventListener("keypress", (event) => { return this.handleKeyboardNavigation(event); }, true);

    this.addEventListener("keypress", (event) => { document.getBindingParent(this).selectEngine(event, false); }, true);

    this.addEventListener("keypress", (event) => { document.getBindingParent(this).selectEngine(event, true); }, true);

    this.addEventListener("keypress", (event) => { return this.openSearch(); }, true);

    this.addEventListener("keypress", (event) => { return this.openSearch(); }, true);

    this.addEventListener("dragover", (event) => {
      var types = event.dataTransfer.types;
      if (types.includes("text/plain") || types.includes("text/x-moz-text-internal"))
        event.preventDefault();
    });

    this.addEventListener("drop", (event) => {
      var dataTransfer = event.dataTransfer;
      var data = dataTransfer.getData("text/plain");
      if (!data)
        data = dataTransfer.getData("text/x-moz-text-internal");
      if (data) {
        event.preventDefault();
        this.value = data;
        document.getBindingParent(this).openSuggestionsPanel();
      }
    });

  }
}