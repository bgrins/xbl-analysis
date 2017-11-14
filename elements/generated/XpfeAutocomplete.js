class FirefoxXpfeAutocomplete extends FirefoxTextbox {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <children includes="menupopup"></children>
      <xul:hbox class="autocomplete-textbox-container" flex="1" align="center">
        <children includes="image|deck|stack|box">
          <xul:image class="autocomplete-icon" allowevents="true"></xul:image>
        </children>
        <xul:hbox class="textbox-input-box" flex="1" inherits="context,tooltiptext=inputtooltiptext">
          <children></children>
          <html:input anonid="input" class="autocomplete-textbox textbox-input" allowevents="true" inherits="tooltiptext=inputtooltiptext,value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,userAction"></html:input>
        </xul:hbox>
        <children includes="hbox"></children>
      </xul:hbox>
      <xul:dropmarker class="autocomplete-history-dropmarker" allowevents="true" inherits="open,enablehistory" anonid="historydropmarker"></xul:dropmarker>
      <xul:popupset>
        <xul:panel type="autocomplete" anonid="popup" ignorekeys="true" noautofocus="true" level="top" inherits="for=id,nomatch"></xul:panel>
      </xul:popupset>
    `;
    Object.defineProperty(this, "popup", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.popup;
        return (this.popup = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "popup"
        ));
      },
      set(val) {
        delete this.popup;
        return (this.popup = val);
      }
    });
    Object.defineProperty(this, "sessionCount", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.sessionCount;
        return (this.sessionCount = 0);
      },
      set(val) {
        delete this.sessionCount;
        return (this.sessionCount = val);
      }
    });
    Object.defineProperty(this, "noMatch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.noMatch;
        return (this.noMatch = true);
      },
      set(val) {
        delete this.noMatch;
        return (this.noMatch = val);
      }
    });
    Object.defineProperty(this, "isSearching", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.isSearching;
        return (this.isSearching = false);
      },
      set(val) {
        delete this.isSearching;
        return (this.isSearching = val);
      }
    });
    Object.defineProperty(this, "mSessions", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mSessions;
        return (this.mSessions = {});
      },
      set(val) {
        delete this.mSessions;
        return (this.mSessions = val);
      }
    });
    Object.defineProperty(this, "mLastResults", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastResults;
        return (this.mLastResults = {});
      },
      set(val) {
        delete this.mLastResults;
        return (this.mLastResults = val);
      }
    });
    Object.defineProperty(this, "mLastRows", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastRows;
        return (this.mLastRows = {});
      },
      set(val) {
        delete this.mLastRows;
        return (this.mLastRows = val);
      }
    });
    Object.defineProperty(this, "mLastKeyCode", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastKeyCode;
        return (this.mLastKeyCode = null);
      },
      set(val) {
        delete this.mLastKeyCode;
        return (this.mLastKeyCode = val);
      }
    });
    Object.defineProperty(this, "mAutoCompleteTimer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mAutoCompleteTimer;
        return (this.mAutoCompleteTimer = 0);
      },
      set(val) {
        delete this.mAutoCompleteTimer;
        return (this.mAutoCompleteTimer = val);
      }
    });
    Object.defineProperty(this, "mMenuOpen", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mMenuOpen;
        return (this.mMenuOpen = false);
      },
      set(val) {
        delete this.mMenuOpen;
        return (this.mMenuOpen = val);
      }
    });
    Object.defineProperty(this, "mFireAfterSearch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mFireAfterSearch;
        return (this.mFireAfterSearch = false);
      },
      set(val) {
        delete this.mFireAfterSearch;
        return (this.mFireAfterSearch = val);
      }
    });
    Object.defineProperty(this, "mFinishAfterSearch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mFinishAfterSearch;
        return (this.mFinishAfterSearch = false);
      },
      set(val) {
        delete this.mFinishAfterSearch;
        return (this.mFinishAfterSearch = val);
      }
    });
    Object.defineProperty(this, "mNeedToFinish", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNeedToFinish;
        return (this.mNeedToFinish = false);
      },
      set(val) {
        delete this.mNeedToFinish;
        return (this.mNeedToFinish = val);
      }
    });
    Object.defineProperty(this, "mNeedToComplete", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNeedToComplete;
        return (this.mNeedToComplete = false);
      },
      set(val) {
        delete this.mNeedToComplete;
        return (this.mNeedToComplete = val);
      }
    });
    Object.defineProperty(this, "mTransientValue", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mTransientValue;
        return (this.mTransientValue = false);
      },
      set(val) {
        delete this.mTransientValue;
        return (this.mTransientValue = val);
      }
    });
    Object.defineProperty(this, "mView", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mView;
        return (this.mView = null);
      },
      set(val) {
        delete this.mView;
        return (this.mView = val);
      }
    });
    Object.defineProperty(this, "currentSearchString", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.currentSearchString;
        return (this.currentSearchString = "");
      },
      set(val) {
        delete this.currentSearchString;
        return (this.currentSearchString = val);
      }
    });
    Object.defineProperty(this, "ignoreInputEvent", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.ignoreInputEvent;
        return (this.ignoreInputEvent = false);
      },
      set(val) {
        delete this.ignoreInputEvent;
        return (this.ignoreInputEvent = val);
      }
    });
    Object.defineProperty(this, "oninit", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.oninit;
        return (this.oninit = null);
      },
      set(val) {
        delete this.oninit;
        return (this.oninit = val);
      }
    });
    Object.defineProperty(this, "mDefaultMatchFilled", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mDefaultMatchFilled;
        return (this.mDefaultMatchFilled = false);
      },
      set(val) {
        delete this.mDefaultMatchFilled;
        return (this.mDefaultMatchFilled = val);
      }
    });
    Object.defineProperty(this, "mFirstReturn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mFirstReturn;
        return (this.mFirstReturn = true);
      },
      set(val) {
        delete this.mFirstReturn;
        return (this.mFirstReturn = val);
      }
    });
    Object.defineProperty(this, "mIsPasting", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mIsPasting;
        return (this.mIsPasting = false);
      },
      set(val) {
        delete this.mIsPasting;
        return (this.mIsPasting = val);
      }
    });
    Object.defineProperty(this, "mPasteController", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPasteController;
        return (this.mPasteController = {
          self: this,
          kGlobalClipboard: Components.interfaces.nsIClipboard.kGlobalClipboard,
          supportsCommand: function(aCommand) {
            return aCommand == "cmd_paste";
          },
          isCommandEnabled: function(aCommand) {
            return (
              aCommand == "cmd_paste" &&
              this.self.editor.isSelectionEditable &&
              this.self.editor.canPaste(this.kGlobalClipboard)
            );
          },
          doCommand: function(aCommand) {
            if (aCommand == "cmd_paste") {
              this.self.mIsPasting = true;
              this.self.editor.paste(this.kGlobalClipboard);
              this.self.mIsPasting = false;
            }
          },
          onEvent: function() {}
        });
      },
      set(val) {
        delete this.mPasteController;
        return (this.mPasteController = val);
      }
    });
    Object.defineProperty(this, "mMenuBarListener", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mMenuBarListener;
        return (this.mMenuBarListener = {
          self: this,
          handleEvent: function(aEvent) {
            try {
              this.self.finishAutoComplete(false, false, aEvent);
              this.self.clearTimer();
              this.self.closePopup();
            } catch (e) {
              window.top.removeEventListener("DOMMenuBarActive", this, true);
            }
          }
        });
      },
      set(val) {
        delete this.mMenuBarListener;
        return (this.mMenuBarListener = val);
      }
    });
    Object.defineProperty(this, "mAutoCompleteObserver", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mAutoCompleteObserver;
        return (this.mAutoCompleteObserver = {
          self: this,
          onSearchResult: function(aSearch, aResult) {
            for (var name in this.self.mSessions)
              if (this.self.mSessions[name] == aSearch)
                this.self.processResults(name, aResult);
          }
        });
      },
      set(val) {
        delete this.mAutoCompleteObserver;
        return (this.mAutoCompleteObserver = val);
      }
    });
    Object.defineProperty(this, "mInputElt", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mInputElt;
        return (this.mInputElt = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input"
        ));
      },
      set(val) {
        delete this.mInputElt;
        return (this.mInputElt = val);
      }
    });
    Object.defineProperty(this, "mMenuAccessKey", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mMenuAccessKey;
        return (this.mMenuAccessKey = Components.classes[
          "@mozilla.org/preferences-service;1"
        ]
          .getService(Components.interfaces.nsIPrefBranch)
          .getIntPref("ui.key.menuAccessKey"));
      },
      set(val) {
        delete this.mMenuAccessKey;
        return (this.mMenuAccessKey = val);
      }
    });
    Object.defineProperty(this, "view", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.view;
        return (this.view = {
          mTextbox: this,
          mTree: null,
          mSelection: null,
          mRowCount: 0,

          clearResults: function() {
            var oldCount = this.mRowCount;
            this.mRowCount = 0;

            if (this.mTree) {
              this.mTree.rowCountChanged(0, -oldCount);
              this.mTree.scrollToRow(0);
            }
          },

          updateResults: function(aRow, aCount) {
            this.mRowCount += aCount;

            if (this.mTree) this.mTree.rowCountChanged(aRow, aCount);
          },

          //////////////////////////////////////////////////////////
          // nsIAutoCompleteController interface

          // this is the only method required by the treebody mouseup handler
          handleEnter: function(aIsPopupSelection) {
            this.mTextbox.onResultClick();
          },

          //////////////////////////////////////////////////////////
          // nsITreeView interface

          get rowCount() {
            return this.mRowCount;
          },

          get selection() {
            return this.mSelection;
          },

          set selection(aVal) {
            return (this.mSelection = aVal);
          },

          setTree: function(aTree) {
            this.mTree = aTree;
          },

          getCellText: function(aRow, aCol) {
            for (var name in this.mTextbox.mSessions) {
              if (aRow < this.mTextbox.mLastRows[name]) {
                var result = this.mTextbox.mLastResults[name];
                switch (aCol.id) {
                  case "treecolAutoCompleteValue":
                    return result.errorDescription || result.getLabelAt(aRow);
                  case "treecolAutoCompleteComment":
                    if (!result.errorDescription)
                      return result.getCommentAt(aRow);
                  default:
                    return "";
                }
              }
              aRow -= this.mTextbox.mLastRows[name];
            }
            return "";
          },

          getRowProperties: function(aIndex) {
            return "";
          },

          getCellProperties: function(aIndex, aCol) {
            // for the value column, append nsIAutoCompleteItem::className
            // to the property list so that we can style this column
            // using that property
            if (aCol.id == "treecolAutoCompleteValue") {
              for (var name in this.mTextbox.mSessions) {
                if (aIndex < this.mTextbox.mLastRows[name]) {
                  var result = this.mTextbox.mLastResults[name];
                  if (result.errorDescription) return "";
                  return result.getStyleAt(aIndex);
                }
                aIndex -= this.mTextbox.mLastRows[name];
              }
            }
            return "";
          },

          getColumnProperties: function(aCol) {
            return "";
          },

          getImageSrc: function(aRow, aCol) {
            if (aCol.id == "treecolAutoCompleteValue") {
              for (var name in this.mTextbox.mSessions) {
                if (aRow < this.mTextbox.mLastRows[name]) {
                  var result = this.mTextbox.mLastResults[name];
                  if (result.errorDescription) return "";
                  return result.getImageAt(aRow);
                }
                aRow -= this.mTextbox.mLastRows[name];
              }
            }
            return "";
          },

          getParentIndex: function(aRowIndex) {},
          hasNextSibling: function(aRowIndex, aAfterIndex) {},
          getLevel: function(aIndex) {},
          getProgressMode: function(aRow, aCol) {},
          getCellValue: function(aRow, aCol) {},
          isContainer: function(aIndex) {},
          isContainerOpen: function(aIndex) {},
          isContainerEmpty: function(aIndex) {},
          isSeparator: function(aIndex) {},
          isSorted: function() {},
          toggleOpenState: function(aIndex) {},
          selectionChanged: function() {},
          cycleHeader: function(aCol) {},
          cycleCell: function(aRow, aCol) {},
          isEditable: function(aRow, aCol) {},
          isSelectable: function(aRow, aCol) {},
          setCellValue: function(aRow, aCol, aValue) {},
          setCellText: function(aRow, aCol, aValue) {},
          performAction: function(aAction) {},
          performActionOnRow: function(aAction, aRow) {},
          performActionOnCell: function(aAction, aRow, aCol) {}
        });
      },
      set(val) {
        delete this.view;
        return (this.view = val);
      }
    });

    // XXX bug 90337 band-aid until we figure out what's going on here
    if (this.value != this.mInputElt.value) this.mInputElt.value = this.value;
    delete this.value;

    // listen for pastes
    this.mInputElt.controllers.insertControllerAt(0, this.mPasteController);

    // listen for menubar activation
    window.top.addEventListener(
      "DOMMenuBarActive",
      this.mMenuBarListener,
      true
    );

    // set default property values
    this.ifSetAttribute("timeout", 50);
    this.ifSetAttribute("pastetimeout", 1000);
    this.ifSetAttribute("maxrows", 5);
    this.ifSetAttribute("showpopup", true);
    this.ifSetAttribute("disableKeyNavigation", true);

    // initialize the search sessions
    if (this.hasAttribute("autocompletesearch")) this.initAutoCompleteSearch();

    // hack to work around lack of bottom-up constructor calling
    if ("initialize" in this.popup) this.popup.initialize();

    this.addEventListener("input", event => {
      if (!this.ignoreInputEvent) this.processInput();
    });

    this.addEventListener(
      "keypress",
      event => {
        return this.processKeyPress(event);
      },
      true
    );

    this.addEventListener(
      "compositionstart",
      event => {
        this.processStartComposition();
      },
      true
    );

    this.addEventListener(
      "focus",
      event => {
        this.userAction = "typing";
      },
      true
    );

    this.addEventListener(
      "blur",
      event => {
        if (!(this.ignoreBlurWhileSearching && this.isSearching)) {
          this.userAction = "none";
          this.finishAutoComplete(false, false, event);
        }
      },
      true
    );

    this.addEventListener(
      "mousedown",
      event => {
        if (!this.mMenuOpen) this.finishAutoComplete(false, false, event);
      },
      true
    );
  }
  disconnectedCallback() {
    this.clearResults(false);
    window.top.removeEventListener(
      "DOMMenuBarActive",
      this.mMenuBarListener,
      true
    );
    this.mInputElt.controllers.removeController(this.mPasteController);
  }

  set popupOpen(val) {
    if (val) this.openPopup();
    else this.closePopup();
    return val;
  }

  get popupOpen() {
    return this.mMenuOpen;
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
    var t = this.getAttribute("minresultsforpopup");
    return t ? parseInt(t) : 1;
  }

  set maxRows(val) {
    this.setAttribute("maxrows", val);
    return val;
  }

  get maxRows() {
    return parseInt(this.getAttribute("maxrows")) || 0;
  }

  set showCommentColumn(val) {
    this.popup.showCommentColumn = val;
    this.setAttribute("showcommentcolumn", val);
    return val;
  }

  get showCommentColumn() {
    return this.getAttribute("showcommentcolumn") == "true";
  }

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 0;
  }

  set searchParam(val) {
    this.setAttribute("autocompletesearchparam", val);
    return val;
  }

  get searchParam() {
    return this.getAttribute("autocompletesearchparam") || "";
  }

  get searchCount() {
    return this.sessionCount;
  }

  set textValue(val) {
    this.setTextValue(val);
    return val;
  }

  get textValue() {
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

  get label() {
    return this.mInputElt.value;
  }

  set open(val) {
    var historyPopup = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "historydropmarker"
    );
    if (val) {
      this.setAttribute("open", true);
      historyPopup.showPopup();
    } else {
      this.removeAttribute("open");
      historyPopup.hidePopup();
    }
  }

  get open() {
    return this.getAttribute("open") == "true";
  }

  set value(val) {
    this.ignoreInputEvent = true;
    this.mInputElt.value = val;
    this.ignoreInputEvent = false;
    var event = document.createEvent("Events");
    event.initEvent("ValueChange", true, true);
    this.mInputElt.dispatchEvent(event);
    return val;
  }

  get value() {
    return this.mInputElt.value;
  }

  get focused() {
    return this.getAttribute("focused") == "true";
  }

  set pasteTimeout(val) {
    this.setAttribute("pastetimeout", val);
    return val;
  }

  get pasteTimeout() {
    var t = parseInt(this.getAttribute("pastetimeout"));
    return t ? t : 0;
  }

  set autoFill(val) {
    this.setAttribute("autofill", val);
    return val;
  }

  get autoFill() {
    return this.getAttribute("autofill") == "true";
  }

  set highlightNonMatches(val) {
    this.setAttribute("highlightnonmatches", val);
    return val;
  }

  get highlightNonMatches() {
    return this.getAttribute("highlightnonmatches") == "true";
  }

  set showPopup(val) {
    this.setAttribute("showpopup", val);
    return val;
  }

  get showPopup() {
    return this.getAttribute("showpopup") == "true";
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

  set userAction(val) {
    this.setAttribute("userAction", val);
    return val;
  }

  get userAction() {
    return this.getAttribute("userAction");
  }

  get isWaiting() {
    return this.mAutoCompleteTimer != 0;
  }
  getSearchAt(aIndex) {
    var idx = -1;
    for (var name in this.mSessions) if (++idx == aIndex) return name;

    return null;
  }
  onSearchBegin() {
    this._fireEvent("searchbegin");
  }
  onSearchComplete() {
    if (this.noMatch) this.setAttribute("nomatch", "true");
    else this.removeAttribute("nomatch");

    this._fireEvent("searchcomplete");
  }
  onTextReverted() {
    return this._fireEvent("textreverted");
  }
  initAutoCompleteSearch() {
    var list = this.getAttribute("autocompletesearch").split(" ");
    for (var i = 0; i < list.length; i++) {
      var name = list[i];
      var contractid = "@mozilla.org/autocomplete/search;1?name=" + name;
      if (contractid in Components.classes) {
        try {
          this.mSessions[name] = Components.classes[contractid].getService(
            Components.interfaces.nsIAutoCompleteSearch
          );
          this.mLastResults[name] = null;
          this.mLastRows[name] = 0;
          ++this.sessionCount;
        } catch (e) {
          dump('### ERROR - unable to create search "' + name + '".\n');
        }
      } else {
        dump('search "' + name + '" not found - skipping.\n');
      }
    }
  }
  getErrorAt(aIndex) {
    var obj = aIndex < 0 ? null : this.convertIndexToSession(aIndex);
    return (
      obj &&
      this.mLastResults[obj.session] &&
      this.mLastResults[obj.session].errorDescription
    );
  }
  getResultValueAt(aIndex) {
    var obj = this.convertIndexToSession(aIndex);
    return obj ? this.getSessionValueAt(obj.session, obj.index) : null;
  }
  getSessionValueAt(aSession, aIndex) {
    var result = this.mLastResults[aSession];
    return result.errorDescription || result.getValueAt(aIndex);
  }
  getResultCount() {
    return this.view.rowCount;
  }
  getDefaultSession() {
    for (var name in this.mLastResults) {
      var results = this.mLastResults[name];
      if (results && results.matchCount > 0 && !results.errorDescription)
        return name;
    }
    return null;
  }
  clearResults(aInvalidate) {
    this.clearResultData();
    this.clearResultElements(aInvalidate);
  }
  callListener(me, aAction) {
    // bail if the binding was detached or the element removed from
    // document during the timeout
    if (!("startLookup" in me) || !me.ownerDocument || !me.parentNode) return;

    me.clearTimer();

    if (me.disableAutoComplete) return;

    switch (aAction) {
      case "startLookup":
        me.startLookup();
        break;

      case "stopLookup":
        me.stopLookup();
        break;
    }
  }
  startLookup() {
    var str = this.currentSearchString;
    if (!str) {
      this.clearResults(false);
      this.closePopup();
      return;
    }

    this.isSearching = true;
    this.mFirstReturn = true;
    this.mSessionReturns = this.sessionCount;
    this.mFailureItems = 0;
    this.mDefaultMatchFilled = false; // clear out our prefill state.

    // Notify the input that the search is beginning.
    this.onSearchBegin();

    // tell each session to start searching...
    for (var name in this.mSessions)
      try {
        this.mSessions[name].startSearch(
          str,
          this.searchParam,
          this.mLastResults[name],
          this.mAutoCompleteObserver
        );
      } catch (e) {
        --this.mSessionReturns;
        this.searchFailed();
      }
  }
  stopLookup() {
    for (var name in this.mSessions) this.mSessions[name].stopSearch();
  }
  processResults(aSessionName, aResults) {
    if (this.disableAutoComplete) return;

    const ACR = Components.interfaces.nsIAutoCompleteResult;
    var status = aResults.searchResult;
    if (
      status != ACR.RESULT_NOMATCH_ONGOING &&
      status != ACR.RESULT_SUCCESS_ONGOING
    )
      --this.mSessionReturns;

    // check the many criteria for failure
    if (aResults.errorDescription) ++this.mFailureItems;
    else if (
      status == ACR.RESULT_IGNORED ||
      status == ACR.RESULT_FAILURE ||
      status == ACR.RESULT_NOMATCH ||
      status == ACR.RESULT_NOMATCH_ONGOING ||
      aResults.matchCount == 0 ||
      aResults.searchString != this.currentSearchString
    ) {
      this.mLastResults[aSessionName] = null;
      if (this.mFirstReturn) this.clearResultElements(false);
      this.mFirstReturn = false;
      this.searchFailed();
      return;
    }

    if (this.mFirstReturn) {
      if (this.view.mTree) this.view.mTree.beginUpdateBatch();
      this.clearResultElements(false); // clear results, but don't repaint yet
    }

    // always call openPopup...we may not have opened it
    // if a previous search session didn't return enough search results.
    // it's smart and doesn't try to open itself multiple times...
    // be sure to add our result elements before calling openPopup as we need
    // to know the total # of results found so far.
    this.addResultElements(aSessionName, aResults);

    this.autoFillInput(aSessionName, aResults, false);
    if (this.mFirstReturn && this.view.mTree) this.view.mTree.endUpdateBatch();
    this.openPopup();
    this.mFirstReturn = false;

    // if this is the last session to return...
    if (this.mSessionReturns == 0) this.postSearchCleanup();

    if (this.mFinishAfterSearch)
      this.finishAutoComplete(false, this.mFireAfterSearch, null);
  }
  searchFailed() {
    // if all searches are done and they all failed...
    if (this.mSessionReturns == 0 && this.getResultCount() == 0) {
      if (this.minResultsForPopup == 0) {
        this.clearResults(true); // clear data and repaint empty
        this.openPopup();
      } else {
        this.closePopup();
      }
    }

    // if it's the last session to return, time to clean up...
    if (this.mSessionReturns == 0) this.postSearchCleanup();
  }
  postSearchCleanup() {
    this.isSearching = false;

    // figure out if there are no matches in all search sessions
    var failed = true;
    for (var name in this.mSessions) {
      if (this.mLastResults[name])
        failed =
          this.mLastResults[name].errorDescription ||
          this.mLastResults[name].matchCount == 0;
      if (!failed) break;
    }
    this.noMatch = failed;

    // if we have processed all of our searches, and none of them gave us a default index,
    // then we should try to auto fill the input field with the first match.
    // note: autoFillInput is smart enough to kick out if we've already prefilled something...
    if (!this.noMatch) {
      var defaultSession = this.getDefaultSession();
      if (defaultSession)
        this.autoFillInput(
          defaultSession,
          this.mLastResults[defaultSession],
          true
        );
    }

    // Notify the input that the search is complete.
    this.onSearchComplete();
  }
  finishAutoComplete(aForceComplete, aFireTextCommand, aTriggeringEvent) {
    this.mFinishAfterSearch = false;
    this.mFireAfterSearch = false;
    if (this.mNeedToFinish && !this.disableAutoComplete) {
      // set textbox value to either override value, or default search result
      var val = this.popup.overrideValue;
      if (val) {
        this.setTextValue(val);
        this.mNeedToFinish = false;
      } else if (
        this.mTransientValue ||
        !(
          this.forceComplete ||
          (aForceComplete && this.mDefaultMatchFilled && this.mNeedToComplete)
        )
      ) {
        this.mNeedToFinish = false;
      } else if (this.isWaiting) {
        // if the user typed, the search results are out of date, so let
        // the search finish, and tell it to come back here when it's done
        this.mFinishAfterSearch = true;
        this.mFireAfterSearch = aFireTextCommand;
        return;
      } else {
        // we want to use the default item index for the first session which gave us a valid
        // default item index...
        for (var name in this.mLastResults) {
          var results = this.mLastResults[name];
          if (
            results &&
            results.matchCount > 0 &&
            !results.errorDescription &&
            results.defaultIndex != -1
          ) {
            val = results.getValueAt(results.defaultIndex);
            this.setTextValue(val);
            this.mDefaultMatchFilled = true;
            this.mNeedToFinish = false;
            break;
          }
        }

        if (this.mNeedToFinish) {
          // if a search is happening at this juncture, bail out of this function
          // and let the search finish, and tell it to come back here when it's done
          if (this.isSearching) {
            this.mFinishAfterSearch = true;
            this.mFireAfterSearch = aFireTextCommand;
            return;
          }

          this.mNeedToFinish = false;
          var defaultSession = this.getDefaultSession();
          if (defaultSession) {
            // preselect the first one
            var first = this.getSessionValueAt(defaultSession, 0);
            this.setTextValue(first);
            this.mDefaultMatchFilled = true;
          }
        }
      }

      this.stopLookup();

      this.closePopup();
    }

    this.mNeedToComplete = false;
    this.clearTimer();

    if (aFireTextCommand)
      this._fireEvent("textentered", this.userAction, aTriggeringEvent);
  }
  onResultClick() {
    // set textbox value to either override value, or the clicked result
    var errItem = this.getErrorAt(this.popup.selectedIndex);
    var val = this.popup.overrideValue;
    if (val) this.setTextValue(val);
    else if (this.popup.selectedIndex != -1) {
      if (errItem) {
        this.setTextValue(this.currentSearchString);
        this.mTransientValue = true;
      } else {
        this.setTextValue(this.getResultValueAt(this.popup.selectedIndex));
      }
    }

    this.mNeedToFinish = false;
    this.mNeedToComplete = false;

    this.closePopup();

    this.currentSearchString = "";

    if (errItem) this._fireEvent("errorcommand", errItem);
    this._fireEvent("textentered", "clicking");
  }
  undoAutoComplete() {
    var val = this.currentSearchString;

    var ok = this.onTextReverted();
    if ((ok || ok == undefined) && val) this.setTextValue(val);

    this.userAction = "typing";

    this.currentSearchString = this.value;
    this.mNeedToComplete = false;
  }
  convertIndexToSession(aIndex) {
    for (var name in this.mLastRows) {
      if (aIndex < this.mLastRows[name])
        return { session: name, index: aIndex };
      aIndex -= this.mLastRows[name];
    }
    return null;
  }
  processInput() {
    // stop current lookup in case it's async.
    this.stopLookup();
    // stop the queued up lookup on a timer
    this.clearTimer();

    if (this.disableAutoComplete) return;

    this.userAction = "typing";
    this.mFinishAfterSearch = false;
    this.mNeedToFinish = true;
    this.mTransientValue = false;
    this.mNeedToComplete = true;
    var str = this.value;
    this.currentSearchString = str;
    this.popup.clearSelection();

    var timeout = this.mIsPasting ? this.pasteTimeout : this.timeout;
    this.mAutoCompleteTimer = setTimeout(
      this.callListener,
      timeout,
      this,
      "startLookup"
    );
  }
  processKeyPress(aEvent) {
    this.mLastKeyCode = aEvent.keyCode;

    var killEvent = false;

    switch (aEvent.keyCode) {
      case KeyEvent.DOM_VK_TAB:
        if (this.tabScrolling) {
          // don't kill this event if alt-tab or ctrl-tab is hit
          if (!aEvent.altKey && !aEvent.ctrlKey) {
            killEvent = this.mMenuOpen;
            if (killEvent) this.keyNavigation(aEvent);
          }
        }
        break;

      case KeyEvent.DOM_VK_RETURN:
        // if this is a failure item, save it for fireErrorCommand
        var errItem = this.getErrorAt(this.popup.selectedIndex);

        killEvent = this.mMenuOpen;
        this.finishAutoComplete(true, true, aEvent);
        this.closePopup();
        if (errItem) {
          this._fireEvent("errorcommand", errItem);
        }
        break;

      case KeyEvent.DOM_VK_ESCAPE:
        this.clearTimer();
        killEvent = this.mMenuOpen;
        this.undoAutoComplete();
        this.closePopup();
        break;

      case KeyEvent.DOM_VK_LEFT:
      case KeyEvent.DOM_VK_RIGHT:
      case KeyEvent.DOM_VK_HOME:
      case KeyEvent.DOM_VK_END:
        this.finishAutoComplete(true, false, aEvent);
        this.clearTimer();
        this.closePopup();
        break;

      case KeyEvent.DOM_VK_DOWN:
        if (!aEvent.altKey) {
          this.clearTimer();
          killEvent = this.keyNavigation(aEvent);
          break;
        }
      // Alt+Down falls through to history popup toggling code

      case KeyEvent.DOM_VK_F4:
        if (
          !aEvent.ctrlKey &&
          !aEvent.shiftKey &&
          this.getAttribute("enablehistory") == "true"
        ) {
          var historyPopup = document.getAnonymousElementByAttribute(
            this,
            "anonid",
            "historydropmarker"
          );
          if (historyPopup) historyPopup.showPopup();
          else historyPopup.hidePopup();
        }
        break;
      case KeyEvent.DOM_VK_PAGE_UP:
      case KeyEvent.DOM_VK_PAGE_DOWN:
      case KeyEvent.DOM_VK_UP:
        if (!aEvent.ctrlKey && !aEvent.metaKey) {
          this.clearTimer();
          killEvent = this.keyNavigation(aEvent);
        }
        break;

      case KeyEvent.DOM_VK_BACK_SPACE:
        if (
          !aEvent.ctrlKey &&
          !aEvent.altKey &&
          !aEvent.shiftKey &&
          this.selectionStart == this.currentSearchString.length &&
          this.selectionEnd == this.value.length &&
          this.mDefaultMatchFilled
        ) {
          this.mDefaultMatchFilled = false;
          this.value = this.currentSearchString;
        }

        if (!/Mac/.test(navigator.platform)) break;
      case KeyEvent.DOM_VK_DELETE:
        if (/Mac/.test(navigator.platform) && !aEvent.shiftKey) break;

        if (this.mMenuOpen && this.popup.selectedIndex != -1) {
          var obj = this.convertIndexToSession(this.popup.selectedIndex);
          if (obj) {
            var result = this.mLastResults[obj.session];
            if (!result.errorDescription) {
              var count = result.matchCount;
              result.removeValueAt(obj.index, true);
              this.view.updateResults(
                this.popup.selectedIndex,
                result.matchCount - count
              );
              killEvent = true;
            }
          }
        }
        break;
    }

    if (killEvent) {
      aEvent.preventDefault();
      aEvent.stopPropagation();
    }

    return true;
  }
  processStartComposition() {
    this.finishAutoComplete(false, false, null);
    this.clearTimer();
    this.closePopup();
  }
  keyNavigation(aEvent) {
    var k = aEvent.keyCode;
    if (
      k == KeyEvent.DOM_VK_TAB ||
      k == KeyEvent.DOM_VK_UP ||
      k == KeyEvent.DOM_VK_DOWN ||
      k == KeyEvent.DOM_VK_PAGE_UP ||
      k == KeyEvent.DOM_VK_PAGE_DOWN
    ) {
      if (!this.mMenuOpen) {
        // Original xpfe style was to allow the up and down keys to have
        // their default Mac action if the popup could not be opened.
        // For compatibility for toolkit we now have to predict which
        // keys have a default action that we can always allow to fire.
        if (
          /Mac/.test(navigator.platform) &&
          ((k == KeyEvent.DOM_VK_UP &&
            (this.selectionStart != 0 || this.selectionEnd != 0)) ||
            (k == KeyEvent.DOM_VK_DOWN &&
              (this.selectionStart != this.value.length ||
                this.selectionEnd != this.value.length)))
        )
          return false;
        if (this.currentSearchString != this.value) {
          this.processInput();
          return true;
        }
        if (this.view.rowCount < this.minResultsForPopup) return true; // used to be false, see above

        this.mNeedToFinish = true;
        this.openPopup();
        return true;
      }

      this.userAction = "scrolling";
      this.mNeedToComplete = false;

      var reverse =
        (k == KeyEvent.DOM_VK_TAB && aEvent.shiftKey) ||
        k == KeyEvent.DOM_VK_UP ||
        k == KeyEvent.DOM_VK_PAGE_UP;
      var page = k == KeyEvent.DOM_VK_PAGE_UP || k == KeyEvent.DOM_VK_PAGE_DOWN;
      var selected = this.popup.selectBy(reverse, page);

      // determine which value to place in the textbox
      this.ignoreInputEvent = true;
      if (selected != -1) {
        if (this.getErrorAt(selected)) {
          if (this.currentSearchString)
            this.setTextValue(this.currentSearchString);
        } else {
          this.setTextValue(this.getResultValueAt(selected));
        }
        this.mTransientValue = true;
      } else {
        if (this.currentSearchString)
          this.setTextValue(this.currentSearchString);
        this.mTransientValue = false;
      }

      // move cursor to the end
      this.mInputElt.setSelectionRange(this.value.length, this.value.length);
      this.ignoreInputEvent = false;
    }
    return true;
  }
  autoFillInput(aSessionName, aResults, aUseFirstMatchIfNoDefault) {
    if (
      this.mInputElt.selectionEnd < this.currentSearchString.length ||
      this.mDefaultMatchFilled
    )
      return;

    if (
      !this.mFinishAfterSearch &&
      (this.autoFill || this.completeDefaultIndex) &&
      this.mLastKeyCode != KeyEvent.DOM_VK_BACK_SPACE &&
      this.mLastKeyCode != KeyEvent.DOM_VK_DELETE
    ) {
      var indexToUse = aResults.defaultIndex;
      if (aUseFirstMatchIfNoDefault && indexToUse == -1) indexToUse = 0;

      if (indexToUse != -1) {
        var resultValue = this.getSessionValueAt(aSessionName, indexToUse);
        var match = resultValue.toLowerCase();
        var entry = this.currentSearchString.toLowerCase();
        this.ignoreInputEvent = true;
        if (match.indexOf(entry) == 0) {
          var endPoint = this.value.length;
          this.setTextValue(this.value + resultValue.substr(endPoint));
          this.mInputElt.setSelectionRange(endPoint, this.value.length);
        } else {
          if (this.completeDefaultIndex) {
            this.setTextValue(this.value + " >> " + resultValue);
            this.mInputElt.setSelectionRange(entry.length, this.value.length);
          } else {
            var postIndex = resultValue.indexOf(this.value);
            if (postIndex >= 0) {
              var startPt = this.value.length;
              this.setTextValue(
                this.value + resultValue.substr(startPt + postIndex)
              );
              this.mInputElt.setSelectionRange(startPt, this.value.length);
            }
          }
        }
        this.mNeedToComplete = true;
        this.ignoreInputEvent = false;
        this.mDefaultMatchFilled = true;
      }
    }
  }
  openPopup() {
    if (
      !this.mMenuOpen &&
      this.focused &&
      (this.getResultCount() >= this.minResultsForPopup || this.mFailureItems)
    ) {
      var w = this.boxObject.width;
      if (w != this.popup.boxObject.width) this.popup.setAttribute("width", w);
      this.popup.showPopup(this, -1, -1, "popup", "bottomleft", "topleft");
      this.mMenuOpen = true;
    }
  }
  closePopup() {
    if (this.popup && this.mMenuOpen) {
      this.popup.hidePopup();
      this.mMenuOpen = false;
    }
  }
  addResultElements(aSession, aResults) {
    var count = aResults.errorDescription ? 1 : aResults.matchCount;
    if (this.focused && this.showPopup) {
      var row = 0;
      for (var name in this.mSessions) {
        row += this.mLastRows[name];
        if (name == aSession) break;
      }
      this.view.updateResults(row, count - this.mLastRows[name]);
      this.popup.adjustHeight();
    }
    this.mLastResults[aSession] = aResults;
    this.mLastRows[aSession] = count;
  }
  clearResultElements(aInvalidate) {
    for (var name in this.mSessions) this.mLastRows[name] = 0;
    this.view.clearResults();
    if (aInvalidate) this.popup.adjustHeight();

    this.noMatch = true;
  }
  setTextValue(aValue) {
    this.value = aValue;

    // Completing a result should simulate the user typing the result,
    // so fire an input event.
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("input", true, false, window, 0);
    var oldIgnoreInput = this.ignoreInputEvent;
    this.ignoreInputEvent = true;
    this.dispatchEvent(evt);
    this.ignoreInputEvent = oldIgnoreInput;
  }
  clearResultData() {
    for (var name in this.mSessions) this.mLastResults[name] = null;
  }
  ifSetAttribute(aAttr, aVal) {
    if (!this.hasAttribute(aAttr)) this.setAttribute(aAttr, aVal);
  }
  clearTimer() {
    if (this.mAutoCompleteTimer) {
      clearTimeout(this.mAutoCompleteTimer);
      this.mAutoCompleteTimer = 0;
    }
  }
  _fireEvent(aEventType, aEventParam, aTriggeringEvent) {
    var noCancel = true;
    // handle any xml attribute event handlers
    var handler = this.getAttribute("on" + aEventType);
    if (handler) {
      var fn = new Function("eventParam", "domEvent", handler);
      var returned = fn.apply(this, [aEventParam, aTriggeringEvent]);
      if (returned == false) noCancel = false;
    }

    return noCancel;
  }
}
customElements.define("firefox-xpfe-autocomplete", FirefoxXpfeAutocomplete);
