class FirefoxAutocomplete extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="autocomplete-textbox-container" flex="1" inherits="focused">
<children includes="image|deck|stack|box">
<image class="autocomplete-icon" allowevents="true">
</image>
</children>
<hbox anonid="textbox-input-box" class="textbox-input-box" flex="1" inherits="tooltiptext=inputtooltiptext">
<children>
</children>
<input anonid="input" class="autocomplete-textbox textbox-input" allowevents="true" inherits="tooltiptext=inputtooltiptext,value,type=inputtype,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint">
</input>
</hbox>
<children includes="hbox">
</children>
</hbox>
<dropmarker anonid="historydropmarker" class="autocomplete-history-dropmarker" allowevents="true" inherits="open,enablehistory,parentfocused=focused">
</dropmarker>
<popupset anonid="popupset" class="autocomplete-result-popupset">
</popupset>
<children includes="toolbarbutton">
</children>`;
    let comment = document.createComment("Creating firefox-autocomplete");
    this.prepend(comment);

    try {
      this.mController = Components.classes[
        "@mozilla.org/autocomplete/controller;1"
      ].getService(Components.interfaces.nsIAutoCompleteController);

      this._searchBeginHandler = this.initEventHandler("searchbegin");
      this._searchCompleteHandler = this.initEventHandler("searchcomplete");
      this._textEnteredHandler = this.initEventHandler("textentered");
      this._textRevertedHandler = this.initEventHandler("textreverted");

      // For security reasons delay searches on pasted values.
      this.inputField.controllers.insertControllerAt(0, this._pasteController);
    } catch (e) {}
    this.mController = null;
    this.mSearchNames = null;
    this.mIgnoreInput = false;
    this._searchBeginHandler = null;
    this._searchCompleteHandler = null;
    this._textEnteredHandler = null;
    this._textRevertedHandler = null;
    this._popup = null;
    this.valueIsTyped = false;
    this._disableTrim = false;
    this._selectionDetails = null;
    this._valueIsPasted = false;
    this._pasteController = {
      _autocomplete: this,
      _kGlobalClipboard: Components.interfaces.nsIClipboard.kGlobalClipboard,
      supportsCommand: aCommand => aCommand == "cmd_paste",
      doCommand(aCommand) {
        this._autocomplete._valueIsPasted = true;
        this._autocomplete.editor.paste(this._kGlobalClipboard);
        this._autocomplete._valueIsPasted = false;
      },
      isCommandEnabled(aCommand) {
        return (
          this._autocomplete.editor.isSelectionEditable &&
          this._autocomplete.editor.canPaste(this._kGlobalClipboard)
        );
      },
      onEvent() {}
    };
  }
  disconnectedCallback() {}

  get shrinkDelay() {
    return parseInt(this.getAttribute("shrinkdelay")) || 0;
  }

  get maxDropMarkerRows() {
    return 14;
  }

  get popup() {
    // Memoize the result in a field rather than replacing this property,
    // so that it can be reset along with the binding.
    if (this._popup) {
      return this._popup;
    }

    let popup = null;
    let popupId = this.getAttribute("autocompletepopup");
    if (popupId) {
      popup = document.getElementById(popupId);
    }
    if (!popup) {
      popup = document.createElement("panel");
      popup.setAttribute("type", "autocomplete");
      popup.setAttribute("noautofocus", "true");

      let popupset = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "popupset"
      );
      popupset.appendChild(popup);
    }
    popup.mInput = this;

    return (this._popup = popup);
  }

  get controller() {
    return this.mController;
  }

  set popupOpen(val) {
    if (val) this.openPopup();
    else this.closePopup();
  }

  get popupOpen() {
    return this.popup.popupOpen;
  }

  set disableAutoComplete(val) {
    this.setAttribute("disableautocomplete", val);
    return val;
  }

  get disableAutoComplete() {
    return this.getAttribute("disableautocomplete") == "true";
  }

  set completeDefaultIndex(val) {
    this.setAttribute("completedefaultindex", val);
    return val;
  }

  get completeDefaultIndex() {
    return this.getAttribute("completedefaultindex") == "true";
  }

  set completeSelectedIndex(val) {
    this.setAttribute("completeselectedindex", val);
    return val;
  }

  get completeSelectedIndex() {
    return this.getAttribute("completeselectedindex") == "true";
  }

  set forceComplete(val) {
    this.setAttribute("forcecomplete", val);
    return val;
  }

  get forceComplete() {
    return this.getAttribute("forcecomplete") == "true";
  }

  set minResultsForPopup(val) {
    this.setAttribute("minresultsforpopup", val);
    return val;
  }

  get minResultsForPopup() {
    var m = parseInt(this.getAttribute("minresultsforpopup"));
    return isNaN(m) ? 1 : m;
  }

  set showCommentColumn(val) {
    this.setAttribute("showcommentcolumn", val);
    return val;
  }

  get showCommentColumn() {
    return this.getAttribute("showcommentcolumn") == "true";
  }

  set showImageColumn(val) {
    this.setAttribute("showimagecolumn", val);
    return val;
  }

  get showImageColumn() {
    return this.getAttribute("showimagecolumn") == "true";
  }

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    // For security reasons delay searches on pasted values.
    if (this._valueIsPasted) {
      let t = parseInt(this.getAttribute("pastetimeout"));
      return isNaN(t) ? 1000 : t;
    }

    let t = parseInt(this.getAttribute("timeout"));
    return isNaN(t) ? 50 : t;
  }

  set searchParam(val) {
    this.setAttribute("autocompletesearchparam", val);
    return val;
  }

  get searchParam() {
    return this.getAttribute("autocompletesearchparam") || "";
  }

  get searchCount() {
    this.initSearchNames();
    return this.mSearchNames.length;
  }

  get PrivateBrowsingUtils() {
    let module = {};
    Components.utils.import(
      "resource://gre/modules/PrivateBrowsingUtils.jsm",
      module
    );
    Object.defineProperty(this, "PrivateBrowsingUtils", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.PrivateBrowsingUtils
    });
    return module.PrivateBrowsingUtils;
  }

  get inPrivateContext() {
    return this.PrivateBrowsingUtils.isWindowPrivate(window);
  }

  get noRollupOnCaretMove() {
    return this.popup.getAttribute("norolluponanchor") == "true";
  }

  set textValue(val) {
    if (typeof this.onBeforeTextValueSet == "function")
      val = this.onBeforeTextValueSet(val);

    this.value = val;

    // Completing a result should simulate the user typing the result, so
    // fire an input event.
    let evt = document.createEvent("UIEvents");
    evt.initUIEvent("input", true, false, window, 0);
    this.mIgnoreInput = true;
    this.dispatchEvent(evt);
    this.mIgnoreInput = false;

    return this.value;
  }

  get textValue() {
    if (typeof this.onBeforeTextValueGet == "function") {
      let result = this.onBeforeTextValueGet();
      if (result) {
        return result.value;
      }
    }
    return this.value;
  }

  get editable() {
    return true;
  }

  set crop(val) {
    this.setAttribute("crop", val);
    return val;
  }

  get crop() {
    return this.getAttribute("crop");
  }

  set open(val) {
    if (val) this.showHistoryPopup();
    else this.closePopup();
  }

  get open() {
    return this.getAttribute("open") == "true";
  }

  set value(val) {
    this.mIgnoreInput = true;

    if (typeof this.onBeforeValueSet == "function")
      val = this.onBeforeValueSet(val);

    if (typeof this.trimValue == "function" && !this._disableTrim)
      val = this.trimValue(val);

    this.valueIsTyped = false;
    this.inputField.value = val;

    if (typeof this.formatValue == "function") this.formatValue();

    this.mIgnoreInput = false;
    var event = document.createEvent("Events");
    event.initEvent("ValueChange", true, true);
    this.inputField.dispatchEvent(event);
    return val;
  }

  get value() {
    if (typeof this.onBeforeValueGet == "function") {
      var result = this.onBeforeValueGet();
      if (result) return result.value;
    }
    return this.inputField.value;
  }

  get focused() {
    return this.getAttribute("focused") == "true";
  }

  set maxRows(val) {
    this.setAttribute("maxrows", val);
    return val;
  }

  get maxRows() {
    return parseInt(this.getAttribute("maxrows")) || 0;
  }

  set tabScrolling(val) {
    this.setAttribute("tabscrolling", val);
    return val;
  }

  get tabScrolling() {
    return this.getAttribute("tabscrolling") == "true";
  }

  set ignoreBlurWhileSearching(val) {
    this.setAttribute("ignoreblurwhilesearching", val);
    return val;
  }

  get ignoreBlurWhileSearching() {
    return this.getAttribute("ignoreblurwhilesearching") == "true";
  }

  set disableKeyNavigation(val) {
    this.setAttribute("disablekeynavigation", val);
    return val;
  }

  get disableKeyNavigation() {
    return this.getAttribute("disablekeynavigation") == "true";
  }

  set highlightNonMatches(val) {
    this.setAttribute("highlightnonmatches", val);
    return val;
  }

  get highlightNonMatches() {
    return this.getAttribute("highlightnonmatches") == "true";
  }
  getSearchAt(aIndex) {
    this.initSearchNames();
    return this.mSearchNames[aIndex];
  }
  setTextValueWithReason(aValue, aReason) {
    if (
      aReason ==
      Components.interfaces.nsIAutoCompleteInput
        .TEXTVALUE_REASON_COMPLETEDEFAULT
    ) {
      this._disableTrim = true;
    }
    this.textValue = aValue;
    this._disableTrim = false;
  }
  selectTextRange(aStartIndex, aEndIndex) {
    this.inputField.setSelectionRange(aStartIndex, aEndIndex);
  }
  onSearchBegin() {
    if (this.popup && typeof this.popup.onSearchBegin == "function")
      this.popup.onSearchBegin();
    if (this._searchBeginHandler) this._searchBeginHandler();
  }
  onSearchComplete() {
    if (this.mController.matchCount == 0) this.setAttribute("nomatch", "true");
    else this.removeAttribute("nomatch");

    if (this.ignoreBlurWhileSearching && !this.focused) {
      this.handleEnter();
      this.detachController();
    }

    if (this._searchCompleteHandler) this._searchCompleteHandler();
  }
  onTextEntered(event) {
    let rv = false;
    if (this._textEnteredHandler) {
      rv = this._textEnteredHandler(event);
    }
    return rv;
  }
  onTextReverted() {
    if (this._textRevertedHandler) return this._textRevertedHandler();
    return false;
  }
  attachController() {
    this.mController.input = this;
  }
  detachController() {
    if (this.mController.input == this) this.mController.input = null;
  }
  openPopup() {
    if (this.focused) this.popup.openAutocompletePopup(this, this);
  }
  closePopup() {
    this.popup.closePopup();
  }
  showHistoryPopup() {
    // history dropmarker pushed state
    function cleanup(popup) {
      popup.removeEventListener("popupshowing", onShow);
    }
    function onShow(event) {
      var popup = event.target,
        input = popup.input;
      cleanup(popup);
      input.setAttribute("open", "true");
      function onHide() {
        input.removeAttribute("open");
        popup.removeEventListener("popuphiding", onHide);
      }
      popup.addEventListener("popuphiding", onHide);
    }
    this.popup.addEventListener("popupshowing", onShow);
    setTimeout(cleanup, 1000, this.popup);

    // Store our "normal" maxRows on the popup, so that it can reset the
    // value when the popup is hidden.
    this.popup._normalMaxRows = this.maxRows;

    // Increase our maxRows temporarily, since we want the dropdown to
    // be bigger in this case. The popup's popupshowing/popuphiding
    // handlers will take care of resetting this.
    this.maxRows = this.maxDropMarkerRows;

    // Ensure that we have focus.
    if (!this.focused) this.focus();
    this.attachController();
    this.mController.startSearch("");
  }
  toggleHistoryPopup() {
    // If this method is called on the same event tick as the popup gets
    // hidden, do nothing to avoid re-opening the popup when the drop
    // marker is clicked while the popup is still open.
    if (!this.popup.isPopupHidingTick && !this.popup.popupOpen)
      this.showHistoryPopup();
    else this.closePopup();
  }
  initEventHandler(aEventType) {
    let handlerString = this.getAttribute("on" + aEventType);
    if (handlerString) {
      return new Function("eventType", "param", handlerString).bind(
        this,
        aEventType
      );
    }
    return null;
  }
  onKeyPress(aEvent) {
    return this.handleKeyPress(aEvent);
  }
  handleKeyPress(aEvent) {
    if (aEvent.target.localName != "textbox") return true; // Let child buttons of autocomplete take input

    // Re: urlbarDeferred, see the comment in urlbarBindings.xml.
    if (aEvent.defaultPrevented && !aEvent.urlbarDeferred) {
      return false;
    }

    var cancel = false;

    // Catch any keys that could potentially move the caret. Ctrl can be
    // used in combination with these keys on Windows and Linux; and Alt
    // can be used on OS X, so make sure the unused one isn't used.
    let metaKey = /Mac/.test(navigator.platform)
      ? aEvent.ctrlKey
      : aEvent.altKey;
    if (!this.disableKeyNavigation && !metaKey) {
      switch (aEvent.keyCode) {
        case KeyEvent.DOM_VK_LEFT:
        case KeyEvent.DOM_VK_RIGHT:
        case KeyEvent.DOM_VK_HOME:
          cancel = this.mController.handleKeyNavigation(aEvent.keyCode);
          break;
      }
    }

    // Handle keys that are not part of a keyboard shortcut (no Ctrl or Alt)
    if (!this.disableKeyNavigation && !aEvent.ctrlKey && !aEvent.altKey) {
      switch (aEvent.keyCode) {
        case KeyEvent.DOM_VK_TAB:
          if (this.tabScrolling && this.popup.popupOpen)
            cancel = this.mController.handleKeyNavigation(
              aEvent.shiftKey ? KeyEvent.DOM_VK_UP : KeyEvent.DOM_VK_DOWN
            );
          else if (this.forceComplete && this.mController.matchCount >= 1)
            this.mController.handleTab();
          break;
        case KeyEvent.DOM_VK_UP:
        case KeyEvent.DOM_VK_DOWN:
        case KeyEvent.DOM_VK_PAGE_UP:
        case KeyEvent.DOM_VK_PAGE_DOWN:
          cancel = this.mController.handleKeyNavigation(aEvent.keyCode);
          break;
      }
    }

    // Handle keys we know aren't part of a shortcut, even with Alt or
    // Ctrl.
    switch (aEvent.keyCode) {
      case KeyEvent.DOM_VK_ESCAPE:
        cancel = this.mController.handleEscape();
        break;
      case KeyEvent.DOM_VK_RETURN:
        if (/Mac/.test(navigator.platform)) {
          // Prevent the default action, since it will beep on Mac
          if (aEvent.metaKey) aEvent.preventDefault();
        }
        if (this.mController.selection) {
          this._selectionDetails = {
            index: this.mController.selection.currentIndex,
            kind: "key"
          };
        }
        cancel = this.handleEnter(aEvent);
        break;
      case KeyEvent.DOM_VK_DELETE:
        if (/Mac/.test(navigator.platform) && !aEvent.shiftKey) {
          break;
        }
        cancel = this.handleDelete();
        break;
      case KeyEvent.DOM_VK_BACK_SPACE:
        if (/Mac/.test(navigator.platform) && aEvent.shiftKey) {
          cancel = this.handleDelete();
        }
        break;
      case KeyEvent.DOM_VK_DOWN:
      case KeyEvent.DOM_VK_UP:
        if (aEvent.altKey) this.toggleHistoryPopup();
        break;
      case KeyEvent.DOM_VK_F4:
        if (!/Mac/.test(navigator.platform)) {
          this.toggleHistoryPopup();
        }
        break;
    }

    if (cancel) {
      aEvent.stopPropagation();
      aEvent.preventDefault();
    }

    return true;
  }
  handleEnter(event) {
    return this.mController.handleEnter(false, event || null);
  }
  handleDelete() {
    return this.mController.handleDelete();
  }
  initSearchNames() {
    if (!this.mSearchNames) {
      var names = this.getAttribute("autocompletesearch");
      if (!names) this.mSearchNames = [];
      else this.mSearchNames = names.split(" ");
    }
  }
  _focus() {
    this._dontBlur = true;
    this.focus();
    this._dontBlur = false;
  }
  resetActionType() {
    if (this.mIgnoreInput) return;
    this.removeAttribute("actiontype");
  }
  onInput(aEvent) {
    if (!this.mIgnoreInput && this.mController.input == this) {
      this.valueIsTyped = true;
      this.mController.handleText();
    }
    this.resetActionType();
  }
}
customElements.define("firefox-autocomplete", FirefoxAutocomplete);
