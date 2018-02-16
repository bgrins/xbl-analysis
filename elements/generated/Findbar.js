class FirefoxFindbar extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox anonid="findbar-container" class="findbar-container" flex="1" align="center">
        <xul:hbox anonid="findbar-textbox-wrapper" align="stretch">
          <xul:textbox anonid="findbar-textbox" class="findbar-textbox findbar-find-fast" inherits="flash"></xul:textbox>
          <xul:toolbarbutton anonid="find-previous" class="findbar-find-previous tabbable" tooltiptext="FROM-DTD-previous-tooltip" oncommand="onFindAgainCommand(true);" disabled="true" inherits="accesskey=findpreviousaccesskey"></xul:toolbarbutton>
          <xul:toolbarbutton anonid="find-next" class="findbar-find-next tabbable" tooltiptext="FROM-DTD-next-tooltip" oncommand="onFindAgainCommand(false);" disabled="true" inherits="accesskey=findnextaccesskey"></xul:toolbarbutton>
        </xul:hbox>
        <xul:toolbarbutton anonid="highlight" class="findbar-highlight findbar-button tabbable" label="FROM-DTD-highlightAll-label" accesskey="FROM-DTD-highlightAll-accesskey" tooltiptext="FROM-DTD-highlightAll-tooltiptext" oncommand="toggleHighlight(this.checked);" type="checkbox" inherits="accesskey=highlightaccesskey"></xul:toolbarbutton>
        <xul:toolbarbutton anonid="find-case-sensitive" class="findbar-case-sensitive findbar-button tabbable" label="FROM-DTD-caseSensitive-label" accesskey="FROM-DTD-caseSensitive-accesskey" tooltiptext="FROM-DTD-caseSensitive-tooltiptext" oncommand="_setCaseSensitivity(this.checked ? 1 : 0);" type="checkbox" inherits="accesskey=matchcaseaccesskey"></xul:toolbarbutton>
        <xul:toolbarbutton anonid="find-entire-word" class="findbar-entire-word findbar-button tabbable" label="FROM-DTD-entireWord-label" accesskey="FROM-DTD-entireWord-accesskey" tooltiptext="FROM-DTD-entireWord-tooltiptext" oncommand="toggleEntireWord(this.checked);" type="checkbox" inherits="accesskey=entirewordaccesskey"></xul:toolbarbutton>
        <xul:label anonid="match-case-status" class="findbar-find-fast"></xul:label>
        <xul:label anonid="entire-word-status" class="findbar-find-fast"></xul:label>
        <xul:label anonid="found-matches" class="findbar-find-fast found-matches" hidden="true"></xul:label>
        <xul:image anonid="find-status-icon" class="findbar-find-fast find-status-icon"></xul:image>
        <xul:description anonid="find-status" control="findbar-textbox" class="findbar-find-fast findbar-find-status"></xul:description>
      </xul:hbox>
      <xul:toolbarbutton anonid="find-closebutton" class="findbar-closebutton close-icon" tooltiptext="FROM-DTD-findCloseButton-tooltip" oncommand="close();"></xul:toolbarbutton>
    `;

    this.FIND_NORMAL = 0;

    this.FIND_TYPEAHEAD = 1;

    this.FIND_LINKS = 2;

    this.__findMode = 0;

    this._flashFindBar = 0;

    this._initialFlashFindBarCount = 6;

    this._startFindDeferred = null;

    this._browser = null;

    this.__prefsvc = null;

    this._observer = {
      _self: this,

      QueryInterface(aIID) {
        if (aIID.equals(Components.interfaces.nsIObserver) ||
          aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
          aIID.equals(Components.interfaces.nsISupports))
          return this;

        throw Components.results.NS_ERROR_NO_INTERFACE;
      },

      observe(aSubject, aTopic, aPrefName) {
        if (aTopic != "nsPref:changed")
          return;

        let prefsvc = this._self._prefsvc;

        switch (aPrefName) {
          case "accessibility.typeaheadfind":
            this._self._findAsYouType = prefsvc.getBoolPref(aPrefName);
            break;
          case "accessibility.typeaheadfind.linksonly":
            this._self._typeAheadLinksOnly = prefsvc.getBoolPref(aPrefName);
            break;
          case "accessibility.typeaheadfind.casesensitive":
            this._self._setCaseSensitivity(prefsvc.getIntPref(aPrefName));
            break;
          case "findbar.entireword":
            this._self._entireWord = prefsvc.getBoolPref(aPrefName);
            this._self.toggleEntireWord(this._self._entireWord, true);
            break;
          case "findbar.highlightAll":
            this._self.toggleHighlight(prefsvc.getBoolPref(aPrefName), true);
            break;
          case "findbar.modalHighlight":
            this._self._useModalHighlight = prefsvc.getBoolPref(aPrefName);
            if (this._self.browser.finder)
              this._self.browser.finder.onModalHighlightChange(this._self._useModalHighlight);
            break;
        }
      }
    };

    this._destroyed = false;

    this._pluralForm = null;

    this._strBundle = null;

    this._xulBrowserWindow = null;

    // These elements are accessed frequently and are therefore cached
    this._findField = this.getElement("findbar-textbox");
    this._foundMatches = this.getElement("found-matches");
    this._findStatusIcon = this.getElement("find-status-icon");
    this._findStatusDesc = this.getElement("find-status");

    this._foundURL = null;

    let prefsvc = this._prefsvc;

    this._quickFindTimeoutLength =
      prefsvc.getIntPref("accessibility.typeaheadfind.timeout");
    this._flashFindBar =
      prefsvc.getIntPref("accessibility.typeaheadfind.flashBar");
    this._useModalHighlight = prefsvc.getBoolPref("findbar.modalHighlight");

    prefsvc.addObserver("accessibility.typeaheadfind",
      this._observer);
    prefsvc.addObserver("accessibility.typeaheadfind.linksonly",
      this._observer);
    prefsvc.addObserver("accessibility.typeaheadfind.casesensitive",
      this._observer);
    prefsvc.addObserver("findbar.entireword", this._observer);
    prefsvc.addObserver("findbar.highlightAll", this._observer);
    prefsvc.addObserver("findbar.modalHighlight", this._observer);

    this._findAsYouType =
      prefsvc.getBoolPref("accessibility.typeaheadfind");
    this._typeAheadLinksOnly =
      prefsvc.getBoolPref("accessibility.typeaheadfind.linksonly");
    this._typeAheadCaseSensitive =
      prefsvc.getIntPref("accessibility.typeaheadfind.casesensitive");
    this._entireWord = prefsvc.getBoolPref("findbar.entireword");
    this._highlightAll = prefsvc.getBoolPref("findbar.highlightAll");

    // Convenience
    this.nsITypeAheadFind = Components.interfaces.nsITypeAheadFind;
    this.nsISelectionController = Components.interfaces.nsISelectionController;
    this._findSelection = this.nsISelectionController.SELECTION_FIND;

    this._findResetTimeout = -1;

    // Make sure the FAYT keypress listener is attached by initializing the
    // browser property
    if (this.getAttribute("browserid"))
      setTimeout(function(aSelf) {
        aSelf.browser = aSelf.browser;
      }, 0, this);

    this.setupHandlers();
  }

  set _findMode(val) {
    this.__findMode = val;
    this._updateBrowserWithState();
    return val;
  }

  get _findMode() {
    return this.__findMode;
  }

  set prefillWithSelection(val) {
    this.setAttribute('prefillwithselection', val);
    return val;
  }

  get prefillWithSelection() {
    return this.getAttribute('prefillwithselection') != 'false'
  }

  get findMode() {
    return this._findMode;
  }

  get hasTransactions() {
    if (this._findField.value)
      return true;

    // Watch out for lazy editor init
    if (this._findField.editor) {
      let tm = this._findField.editor.transactionManager;
      return !!(tm.numberOfUndoItems || tm.numberOfRedoItems);
    }
    return false;
  }

  set browser(val) {
    if (this._browser) {
      if (this._browser.messageManager) {
        this._browser.messageManager.removeMessageListener("Findbar:Keypress", this);
        this._browser.messageManager.removeMessageListener("Findbar:Mouseup", this);
      }
      let finder = this._browser.finder;
      if (finder)
        finder.removeResultListener(this);
    }

    this._browser = val;
    if (this._browser) {
      // Need to do this to ensure the correct initial state.
      this._updateBrowserWithState();
      this._browser.messageManager.addMessageListener("Findbar:Keypress", this);
      this._browser.messageManager.addMessageListener("Findbar:Mouseup", this);
      this._browser.finder.addResultListener(this);

      this._findField.value = this._browser._lastSearchString;
    }
    return val;
  }

  get browser() {
    if (!this._browser) {
      this._browser =
        document.getElementById(this.getAttribute("browserid"));
    }
    return this._browser;
  }

  get _prefsvc() {
    if (!this.__prefsvc) {
      this.__prefsvc = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefBranch);
    }
    return this.__prefsvc;
  }

  get pluralForm() {
    if (!this._pluralForm) {
      this._pluralForm = ChromeUtils.import(
        "resource://gre/modules/PluralForm.jsm", {}).PluralForm;
    }
    return this._pluralForm;
  }

  get strBundle() {
    if (!this._strBundle) {
      this._strBundle =
        Components.classes["@mozilla.org/intl/stringbundle;1"]
        .getService(Components.interfaces.nsIStringBundleService)
        .createBundle("chrome://global/locale/findbar.properties");
    }
    return this._strBundle;
  }
  getElement(aAnonymousID) {
    return document.getAnonymousElementByAttribute(this,
      "anonid",
      aAnonymousID);
  }
  destroy() {
    if (this._destroyed)
      return;
    this._destroyed = true;

    if (this.browser.finder)
      this.browser.finder.destroy();

    this.browser = null;

    let prefsvc = this._prefsvc;
    prefsvc.removeObserver("accessibility.typeaheadfind",
      this._observer);
    prefsvc.removeObserver("accessibility.typeaheadfind.linksonly",
      this._observer);
    prefsvc.removeObserver("accessibility.typeaheadfind.casesensitive",
      this._observer);
    prefsvc.removeObserver("findbar.entireword", this._observer);
    prefsvc.removeObserver("findbar.highlightAll", this._observer);
    prefsvc.removeObserver("findbar.modalHighlight", this._observer);

    // Clear all timers that might still be running.
    this._cancelTimers();
  }
  _cancelTimers() {
    if (this._flashFindBarTimeout) {
      clearInterval(this._flashFindBarTimeout);
      this._flashFindBarTimeout = null;
    }
    if (this._quickFindTimeout) {
      clearTimeout(this._quickFindTimeout);
      this._quickFindTimeout = null;
    }
    if (this._findResetTimeout) {
      clearTimeout(this._findResetTimeout);
      this._findResetTimeout = null;
    }
  }
  _setFindCloseTimeout() {
    if (this._quickFindTimeout)
      clearTimeout(this._quickFindTimeout);

    // Don't close the find toolbar while IME is composing OR when the
    // findbar is already hidden.
    if (this._isIMEComposing || this.hidden) {
      this._quickFindTimeout = null;
      return;
    }

    this._quickFindTimeout = setTimeout(() => {
      if (this._findMode != this.FIND_NORMAL)
        this.close();
      this._quickFindTimeout = null;
    }, this._quickFindTimeoutLength);
  }
  _updateMatchesCount() {
    if (!this._dispatchFindEvent("matchescount"))
      return;

    this.browser.finder.requestMatchesCount(this._findField.value,
      this._findMode == this.FIND_LINKS);
  }
  toggleHighlight(aHighlight, aFromPrefObserver) {
    if (aHighlight === this._highlightAll) {
      return;
    }

    this.browser.finder.onHighlightAllChange(aHighlight);

    this._setHighlightAll(aHighlight, aFromPrefObserver);

    if (!this._dispatchFindEvent("highlightallchange")) {
      return;
    }

    let word = this._findField.value;
    // Bug 429723. Don't attempt to highlight ""
    if (aHighlight && !word)
      return;

    this.browser.finder.highlight(aHighlight, word,
      this._findMode == this.FIND_LINKS);

    // Update the matches count
    this._updateMatchesCount(this.nsITypeAheadFind.FIND_FOUND);
  }
  _setHighlightAll(aHighlight, aFromPrefObserver) {
    if (typeof aHighlight != "boolean") {
      aHighlight = this._highlightAll;
    }
    if (aHighlight !== this._highlightAll && !aFromPrefObserver) {
      this._prefsvc.setBoolPref("findbar.highlightAll", aHighlight);
    }
    this._highlightAll = aHighlight;
    let checkbox = this.getElement("highlight");
    checkbox.checked = this._highlightAll;
  }
  _updateCaseSensitivity(aString) {
    let val = aString || this._findField.value;

    let caseSensitive = this._shouldBeCaseSensitive(val);
    let checkbox = this.getElement("find-case-sensitive");
    let statusLabel = this.getElement("match-case-status");
    checkbox.checked = caseSensitive;

    statusLabel.value = caseSensitive ? this._caseSensitiveStr : "";

    // Show the checkbox on the full Find bar in non-auto mode.
    // Show the label in all other cases.
    let hideCheckbox = this._findMode != this.FIND_NORMAL ||
      (this._typeAheadCaseSensitive != 0 &&
        this._typeAheadCaseSensitive != 1);
    checkbox.hidden = hideCheckbox;
    statusLabel.hidden = !hideCheckbox;

    this.browser.finder.caseSensitive = caseSensitive;
  }
  _setCaseSensitivity(aCaseSensitivity) {
    this._typeAheadCaseSensitive = aCaseSensitivity;
    this._updateCaseSensitivity();
    this._findFailedString = null;
    this._find();

    this._dispatchFindEvent("casesensitivitychange");
  }
  _setEntireWord() {
    let entireWord = this._entireWord;
    let checkbox = this.getElement("find-entire-word");
    let statusLabel = this.getElement("entire-word-status");
    checkbox.checked = entireWord;

    statusLabel.value = entireWord ? this._entireWordStr : "";

    // Show the checkbox on the full Find bar in non-auto mode.
    // Show the label in all other cases.
    let hideCheckbox = this._findMode != this.FIND_NORMAL;
    checkbox.hidden = hideCheckbox;
    statusLabel.hidden = !hideCheckbox;

    this.browser.finder.entireWord = entireWord;
  }
  toggleEntireWord(aEntireWord, aFromPrefObserver) {
    if (!aFromPrefObserver) {
      // Just set the pref; our observer will change the find bar behavior.
      this._prefsvc.setBoolPref("findbar.entireword", aEntireWord);
      return;
    }

    this._findFailedString = null;
    this._find();
  }
  open(aMode) {
    if (aMode != undefined)
      this._findMode = aMode;

    if (!this._notFoundStr) {
      var stringsBundle = this.strBundle;
      this._notFoundStr = stringsBundle.GetStringFromName("NotFound");
      this._wrappedToTopStr =
        stringsBundle.GetStringFromName("WrappedToTop");
      this._wrappedToBottomStr =
        stringsBundle.GetStringFromName("WrappedToBottom");
      this._normalFindStr =
        stringsBundle.GetStringFromName("NormalFind");
      this._fastFindStr =
        stringsBundle.GetStringFromName("FastFind");
      this._fastFindLinksStr =
        stringsBundle.GetStringFromName("FastFindLinks");
      this._caseSensitiveStr =
        stringsBundle.GetStringFromName("CaseSensitive");
      this._entireWordStr =
        stringsBundle.GetStringFromName("EntireWord");
    }

    this._findFailedString = null;

    this._updateFindUI();
    if (this.hidden) {
      this.removeAttribute("noanim");
      this.hidden = false;

      this._updateStatusUI(this.nsITypeAheadFind.FIND_FOUND);

      let event = document.createEvent("Events");
      event.initEvent("findbaropen", true, false);
      this.dispatchEvent(event);

      this.browser.finder.onFindbarOpen();

      return true;
    }
    return false;
  }
  close(aNoAnim) {
    if (this.hidden)
      return;

    if (aNoAnim)
      this.setAttribute("noanim", true);
    this.hidden = true;

    // 'focusContent()' iterates over all listeners in the chrome
    // process, so we need to call it from here.
    this.browser.finder.focusContent();
    this.browser.finder.onFindbarClose();

    this._cancelTimers();

    this._findFailedString = null;
  }
  clear() {
    this.browser.finder.removeSelection();
    this._findField.reset();
    this.toggleHighlight(false);
    this._updateStatusUI();
    this._enableFindButtons(false);
  }
  _dispatchKeypressEvent(aTarget, aEvent) {
    if (!aTarget)
      return;

    let event = document.createEvent("KeyboardEvent");
    event.initKeyEvent(aEvent.type, aEvent.bubbles, aEvent.cancelable,
      aEvent.view, aEvent.ctrlKey, aEvent.altKey,
      aEvent.shiftKey, aEvent.metaKey, aEvent.keyCode,
      aEvent.charCode);
    aTarget.dispatchEvent(event);
  }
  _updateStatusUIBar(aFoundURL) {
    if (!this._xulBrowserWindow) {
      try {
        this._xulBrowserWindow =
          window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
          .getInterface(Components.interfaces.nsIWebNavigation)
          .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
          .treeOwner
          .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
          .getInterface(Components.interfaces.nsIXULWindow)
          .XULBrowserWindow;
      } catch (ex) {}
      if (!this._xulBrowserWindow)
        return false;
    }

    // Call this has the same effect like hovering over link,
    // the browser shows the URL as a tooltip.
    this._xulBrowserWindow.setOverLink(aFoundURL || "", null);
    return true;
  }
  _finishFAYT(aKeypressEvent) {
    this.browser.finder.focusContent();

    if (aKeypressEvent)
      aKeypressEvent.preventDefault();

    this.browser.finder.keyPress(aKeypressEvent);

    this.close();
    return true;
  }
  _shouldBeCaseSensitive(aString) {
    if (this._typeAheadCaseSensitive == 0)
      return false;
    if (this._typeAheadCaseSensitive == 1)
      return true;

    return aString != aString.toLowerCase();
  }
  _onBrowserKeypress(aFakeEvent, aShouldFastFind) {
    const FAYT_LINKS_KEY = "'";
    const FAYT_TEXT_KEY = "/";

    // Fast keypresses can stack up when the content process is slow or
    // hangs when in e10s mode. We make sure the findbar isn't 'opened'
    // several times in a row, because then the find query is selected
    // each time, losing characters typed initially.
    let inputField = this._findField.inputField;
    if (!this.hidden && document.activeElement == inputField) {
      this._dispatchKeypressEvent(inputField, aFakeEvent);
      return false;
    }

    if (this._findMode != this.FIND_NORMAL && this._quickFindTimeout) {
      if (!aFakeEvent.charCode)
        return true;

      this._findField.select();
      this._findField.focus();
      this._dispatchKeypressEvent(this._findField.inputField, aFakeEvent);
      return false;
    }

    if (!aShouldFastFind)
      return true;

    let key = aFakeEvent.charCode ? String.fromCharCode(aFakeEvent.charCode) : null;
    let manualstartFAYT = (key == FAYT_LINKS_KEY || key == FAYT_TEXT_KEY);
    let autostartFAYT = !manualstartFAYT && this._findAsYouType &&
      key && key != " ";
    if (manualstartFAYT || autostartFAYT) {
      let mode = (key == FAYT_LINKS_KEY ||
          (autostartFAYT && this._typeAheadLinksOnly)) ?
        this.FIND_LINKS : this.FIND_TYPEAHEAD;

      // Clear bar first, so that when openFindBar() calls setCaseSensitivity()
      // it doesn't get confused by a lingering value
      this._findField.value = "";

      this.open(mode);
      this._setFindCloseTimeout();
      this._findField.select();
      this._findField.focus();

      if (autostartFAYT)
        this._dispatchKeypressEvent(this._findField.inputField, aFakeEvent);
      else
        this._updateStatusUI(this.nsITypeAheadFind.FIND_FOUND);

      return false;
    }
    return undefined;
  }
  receiveMessage(aMessage) {
    if (aMessage.target != this._browser) {
      return undefined;
    }
    switch (aMessage.name) {
      case "Findbar:Mouseup":
        if (!this.hidden && this._findMode != this.FIND_NORMAL)
          this.close();
        break;

      case "Findbar:Keypress":
        return this._onBrowserKeypress(aMessage.data.fakeEvent,
          aMessage.data.shouldFastFind);
    }
    return undefined;
  }
  _updateBrowserWithState() {
    if (this._browser && this._browser.messageManager) {
      this._browser.messageManager.sendAsyncMessage("Findbar:UpdateState", {
        findMode: this._findMode
      });
    }
  }
  _enableFindButtons(aEnable) {
    this.getElement("find-next").disabled =
      this.getElement("find-previous").disabled = !aEnable;
  }
  _updateFindUI() {
    let showMinimalUI = this._findMode != this.FIND_NORMAL;

    let nodes = this.getElement("findbar-container").childNodes;
    let wrapper = this.getElement("findbar-textbox-wrapper");
    let foundMatches = this._foundMatches;
    for (let node of nodes) {
      if (node == wrapper || node == foundMatches)
        continue;
      node.hidden = showMinimalUI;
    }
    this.getElement("find-next").hidden =
      this.getElement("find-previous").hidden = showMinimalUI;
    foundMatches.hidden = showMinimalUI || !foundMatches.value;
    this._updateCaseSensitivity();
    this._setEntireWord();
    this._setHighlightAll();

    if (showMinimalUI)
      this._findField.classList.add("minimal");
    else
      this._findField.classList.remove("minimal");

    if (this._findMode == this.FIND_TYPEAHEAD)
      this._findField.placeholder = this._fastFindStr;
    else if (this._findMode == this.FIND_LINKS)
      this._findField.placeholder = this._fastFindLinksStr;
    else
      this._findField.placeholder = this._normalFindStr;
  }
  _find(aValue) {
    if (!this._dispatchFindEvent(""))
      return;

    let val = aValue || this._findField.value;

    // We have to carry around an explicit version of this,
    // because finder.searchString doesn't update on failed
    // searches.
    this.browser._lastSearchString = val;

    // Only search on input if we don't have a last-failed string,
    // or if the current search string doesn't start with it.
    // In entire-word mode we always attemp a find; since sequential matching
    // is not guaranteed, the first character typed may not be a word (no
    // match), but the with the second character it may well be a word,
    // thus a match.
    if (!this._findFailedString ||
      !val.startsWith(this._findFailedString) ||
      this._entireWord) {
      // Getting here means the user commanded a find op. Make sure any
      // initial prefilling is ignored if it hasn't happened yet.
      if (this._startFindDeferred) {
        this._startFindDeferred.resolve();
        this._startFindDeferred = null;
      }

      this._enableFindButtons(val);
      this._updateCaseSensitivity(val);
      this._setEntireWord();

      this.browser.finder.fastFind(val, this._findMode == this.FIND_LINKS,
        this._findMode != this.FIND_NORMAL);
    }

    if (this._findMode != this.FIND_NORMAL)
      this._setFindCloseTimeout();

    if (this._findResetTimeout != -1)
      clearTimeout(this._findResetTimeout);

    // allow a search to happen on input again after a second has
    // expired since the previous input, to allow for dynamic
    // content and/or page loading
    this._findResetTimeout = setTimeout(() => {
      this._findFailedString = null;
      this._findResetTimeout = -1;
    }, 1000);
  }
  _flash() {
    if (this._flashFindBarCount === undefined)
      this._flashFindBarCount = this._initialFlashFindBarCount;

    if (this._flashFindBarCount-- == 0) {
      clearInterval(this._flashFindBarTimeout);
      this.removeAttribute("flash");
      this._flashFindBarCount = 6;
      return;
    }

    this.setAttribute("flash",
      (this._flashFindBarCount % 2 == 0) ?
      "false" : "true");
  }
  _findAgain(aFindPrevious) {
    this.browser.finder.findAgain(aFindPrevious,
      this._findMode == this.FIND_LINKS,
      this._findMode != this.FIND_NORMAL);
  }
  _updateStatusUI(res, aFindPrevious) {
    switch (res) {
      case this.nsITypeAheadFind.FIND_WRAPPED:
        this._findStatusIcon.setAttribute("status", "wrapped");
        this._findStatusDesc.textContent =
          aFindPrevious ? this._wrappedToBottomStr : this._wrappedToTopStr;
        this._findField.removeAttribute("status");
        break;
      case this.nsITypeAheadFind.FIND_NOTFOUND:
        this._findStatusIcon.setAttribute("status", "notfound");
        this._findStatusDesc.textContent = this._notFoundStr;
        this._findField.setAttribute("status", "notfound");
        break;
      case this.nsITypeAheadFind.FIND_PENDING:
        this._findStatusIcon.setAttribute("status", "pending");
        this._findStatusDesc.textContent = "";
        this._findField.removeAttribute("status");
        break;
      case this.nsITypeAheadFind.FIND_FOUND:
      default:
        this._findStatusIcon.removeAttribute("status");
        this._findStatusDesc.textContent = "";
        this._findField.removeAttribute("status");
        break;
    }
  }
  updateControlState(aResult, aFindPrevious) {
    this._updateStatusUI(aResult, aFindPrevious);
    this._enableFindButtons(aResult !== this.nsITypeAheadFind.FIND_NOTFOUND &&
      !!this._findField.value);
  }
  _dispatchFindEvent(aType, aFindPrevious) {
    let event = document.createEvent("CustomEvent");
    event.initCustomEvent("find" + aType, true, true, {
      query: this._findField.value,
      caseSensitive: !!this._typeAheadCaseSensitive,
      entireWord: this._entireWord,
      highlightAll: this._highlightAll,
      findPrevious: aFindPrevious
    });
    return this.dispatchEvent(event);
  }
  startFind(aMode) {
    let prefsvc = this._prefsvc;
    let userWantsPrefill = true;
    this.open(aMode);

    if (this._flashFindBar) {
      this._flashFindBarTimeout = setInterval(() => this._flash(), 500);
      prefsvc.setIntPref("accessibility.typeaheadfind.flashBar",
        --this._flashFindBar);
    }

    let {
      PromiseUtils
    } =
    ChromeUtils.import("resource://gre/modules/PromiseUtils.jsm", {});
    this._startFindDeferred = PromiseUtils.defer();
    let startFindPromise = this._startFindDeferred.promise;

    if (this.prefillWithSelection)
      userWantsPrefill =
      prefsvc.getBoolPref("accessibility.typeaheadfind.prefillwithselection");

    if (this.prefillWithSelection && userWantsPrefill) {
      // NB: We have to focus this._findField here so tests that send
      // key events can open and close the find bar synchronously.
      this._findField.focus();

      // (e10s) since we focus lets also select it, otherwise that would
      // only happen in this.onCurrentSelection and, because it is async,
      // there's a chance keypresses could come inbetween, leading to
      // jumbled up queries.
      this._findField.select();

      this.browser.finder.getInitialSelection();
      return startFindPromise;
    }

    // If userWantsPrefill is false but prefillWithSelection is true,
    // then we might need to check the selection clipboard. Call
    // onCurrentSelection to do so.
    // Note: this.onCurrentSelection clears this._startFindDeferred.
    this.onCurrentSelection("", true);
    return startFindPromise;
  }
  onFindCommand() {
    return this.startFind(this.FIND_NORMAL);
  }
  onFindAgainCommand(aFindPrevious) {
    let findString = this._browser.finder.searchString || this._findField.value;
    if (!findString)
      return this.startFind();

    // We dispatch the findAgain event here instead of in _findAgain since
    // if there is a find event handler that prevents the default then
    // finder.searchString will never get updated which in turn means
    // there would never be findAgain events because of the logic below.
    if (!this._dispatchFindEvent("again", aFindPrevious))
      return undefined;

    // user explicitly requested another search, so do it even if we think it'll fail
    this._findFailedString = null;

    // Ensure the stored SearchString is in sync with what we want to find
    if (this._findField.value != this._browser.finder.searchString) {
      this._find(this._findField.value);
    } else {
      this._findAgain(aFindPrevious);
      if (this._useModalHighlight) {
        this.open();
        this._findField.focus();
      }
    }

    return undefined;
  }
  onFindResult(aData) {
    if (aData.result == this.nsITypeAheadFind.FIND_NOTFOUND) {
      // If an explicit Find Again command fails, re-open the toolbar.
      if (aData.storeResult && this.open()) {
        this._findField.select();
        this._findField.focus();
      }
      this._findFailedString = aData.searchString;
    } else {
      this._findFailedString = null;
    }

    this._updateStatusUI(aData.result, aData.findBackwards);
    this._updateStatusUIBar(aData.linkURL);

    if (this._findMode != this.FIND_NORMAL)
      this._setFindCloseTimeout();
  }
  onMatchesCountResult(aResult) {
    if (aResult.total !== 0) {
      if (aResult.total == -1) {
        this._foundMatches.value = this.pluralForm.get(
          aResult.limit,
          this.strBundle.GetStringFromName("FoundMatchesCountLimit")
        ).replace("#1", aResult.limit);
      } else {
        this._foundMatches.value = this.pluralForm.get(
            aResult.total,
            this.strBundle.GetStringFromName("FoundMatches")
          ).replace("#1", aResult.current)
          .replace("#2", aResult.total);
      }
      this._foundMatches.hidden = false;
    } else {
      this._foundMatches.hidden = true;
      this._foundMatches.value = "";
    }
  }
  onHighlightFinished(result) {
    // Noop.
  }
  onCurrentSelection(aSelectionString, aIsInitialSelection) {
    // Ignore the prefill if the user has already typed in the findbar,
    // it would have been overwritten anyway. See bug 1198465.
    if (aIsInitialSelection && !this._startFindDeferred)
      return;

    if (/Mac/.test(navigator.platform) && aIsInitialSelection && !aSelectionString) {
      let clipboardSearchString = this.browser.finder.clipboardSearchString;
      if (clipboardSearchString)
        aSelectionString = clipboardSearchString;
    }

    if (aSelectionString)
      this._findField.value = aSelectionString;

    if (aIsInitialSelection) {
      this._enableFindButtons(!!this._findField.value);
      this._findField.select();
      this._findField.focus();

      this._startFindDeferred.resolve();
      this._startFindDeferred = null;
    }
  }
  shouldFocusContent() {
    const fm = Components.classes["@mozilla.org/focus-manager;1"]
      .getService(Components.interfaces.nsIFocusManager);
    if (fm.focusedWindow != window)
      return false;

    let focusedElement = fm.focusedElement;
    if (!focusedElement)
      return false;

    let bindingParent = document.getBindingParent(focusedElement);
    if (bindingParent != this && bindingParent != this._findField)
      return false;

    return true;
  }
  disconnectedCallback() {
    this.destroy();
  }

  setupHandlers() {

    this.addEventListener("keypress", (event) => {
      if (this.close) this.close();
    }, true);

  }
}