class FirefoxUrlbarRichResultPopup extends FirefoxAutocompleteRichResultPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:deck anonid="search-suggestions-notification" align="center" role="alert" selectedIndex="0">
        <xul:hbox flex="1" align="center" anonid="search-suggestions-opt-out">
          <xul:image class="ac-site-icon" type="searchengine"></xul:image>
          <xul:hbox anonid="search-suggestions-hint-typing">
            <xul:description class="ac-title-text"></xul:description>
          </xul:hbox>
          <xul:hbox anonid="search-suggestions-hint-box" flex="1">
            <xul:description id="search-suggestions-hint">
              <html:span class="prefix"></html:span>
              <html:span></html:span>
            </xul:description>
          </xul:hbox>
          <xul:label id="search-suggestions-change-settings" class="text-link" role="link" value="FROM-DTD-urlbar-searchSuggestionsNotification-changeSettingsWin" accesskey="FROM-DTD-urlbar-searchSuggestionsNotification-changeSettingsWin-accesskey" onclick="openPreferences('paneSearch');" control="search-suggestions-change-settings"></xul:label>
        </xul:hbox>
      </xul:deck>
      <xul:richlistbox anonid="richlistbox" class="autocomplete-richlistbox" flex="1"></xul:richlistbox>
      <xul:hbox anonid="footer">
        <children></children>
        <xul:vbox anonid="one-off-search-buttons" class="search-one-offs" compact="true" includecurrentengine="true" disabletab="true" flex="1"></xul:vbox>
      </xul:hbox>
    `;
    Object.defineProperty(this, "DOMWindowUtils", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.DOMWindowUtils;
        return (this.DOMWindowUtils = window
          .QueryInterface(Ci.nsIInterfaceRequestor)
          .getInterface(Ci.nsIDOMWindowUtils));
      },
      set(val) {
        delete this.DOMWindowUtils;
        return (this.DOMWindowUtils = val);
      }
    });
    Object.defineProperty(this, "_maxResults", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._maxResults;
        return (this._maxResults = 0);
      },
      set(val) {
        delete this._maxResults;
        return (this._maxResults = val);
      }
    });
    Object.defineProperty(this, "_bundle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._bundle;
        return (this._bundle = Cc["@mozilla.org/intl/stringbundle;1"]
          .getService(Ci.nsIStringBundleService)
          .createBundle("chrome://browser/locale/places/places.properties"));
      }
    });
    Object.defineProperty(this, "searchSuggestionsNotification", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.searchSuggestionsNotification;
        return (this.searchSuggestionsNotification = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "search-suggestions-notification"
        ));
      }
    });
    Object.defineProperty(this, "footer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.footer;
        return (this.footer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "footer"
        ));
      }
    });
    Object.defineProperty(this, "oneOffSearchButtons", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.oneOffSearchButtons;
        return (this.oneOffSearchButtons = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "one-off-search-buttons"
        ));
      }
    });
    Object.defineProperty(this, "_oneOffSearchesEnabled", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._oneOffSearchesEnabled;
        return (this._oneOffSearchesEnabled = false);
      },
      set(val) {
        delete this._oneOffSearchesEnabled;
        return (this._oneOffSearchesEnabled = val);
      }
    });
    Object.defineProperty(this, "_overrideValue", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._overrideValue;
        return (this._overrideValue = null);
      },
      set(val) {
        delete this._overrideValue;
        return (this._overrideValue = val);
      }
    });
    Object.defineProperty(this, "_addonIframe", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframe;
        return (this._addonIframe = null);
      },
      set(val) {
        delete this._addonIframe;
        return (this._addonIframe = val);
      }
    });
    Object.defineProperty(this, "_addonIframeOwner", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframeOwner;
        return (this._addonIframeOwner = null);
      },
      set(val) {
        delete this._addonIframeOwner;
        return (this._addonIframeOwner = val);
      }
    });
    Object.defineProperty(this, "_addonIframeOverriddenFunctionsByName", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframeOverriddenFunctionsByName;
        return (this._addonIframeOverriddenFunctionsByName = {});
      },
      set(val) {
        delete this._addonIframeOverriddenFunctionsByName;
        return (this._addonIframeOverriddenFunctionsByName = val);
      }
    });
    Object.defineProperty(this, "_addonIframeOverrideFunctionNames", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframeOverrideFunctionNames;
        return (this._addonIframeOverrideFunctionNames = ["_invalidate"]);
      },
      set(val) {
        delete this._addonIframeOverrideFunctionNames;
        return (this._addonIframeOverrideFunctionNames = val);
      }
    });
    Object.defineProperty(this, "_addonIframeHiddenAnonids", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframeHiddenAnonids;
        return (this._addonIframeHiddenAnonids = [
          "search-suggestions-notification",
          "richlistbox",
          "one-off-search-buttons"
        ]);
      },
      set(val) {
        delete this._addonIframeHiddenAnonids;
        return (this._addonIframeHiddenAnonids = val);
      }
    });
    Object.defineProperty(this, "_addonIframeHiddenDisplaysByAnonid", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._addonIframeHiddenDisplaysByAnonid;
        return (this._addonIframeHiddenDisplaysByAnonid = {});
      },
      set(val) {
        delete this._addonIframeHiddenDisplaysByAnonid;
        return (this._addonIframeHiddenDisplaysByAnonid = val);
      }
    });

    this.addEventListener("SelectedOneOffButtonChanged", event => {
      this._selectedOneOffChanged();
    });

    this.addEventListener("mousedown", event => {
      // Required to make the xul:label.text-link elements in the search
      // suggestions notification work correctly when clicked on Linux.
      // This is copied from the mousedown handler in
      // browser-search-autocomplete-result-popup, which apparently had a
      // similar problem.
      event.preventDefault();

      if (!this.input.speculativeConnectEnabled) {
        return;
      }
      if (event.button == 2) {
        // Ignore right-clicks.
        return;
      }
      // Ensure the user is clicking on an url instead of other buttons
      // on the popup.
      let elt = event.originalTarget;
      while (elt && elt.localName != "richlistitem" && elt != this) {
        elt = elt.parentNode;
      }
      if (!elt || elt.localName != "richlistitem") {
        return;
      }
      // The user might click on a ghost entry which was removed because of
      // the coming new results.
      if (this.input.controller.matchCount <= this.selectedIndex) {
        return;
      }

      let url = this.input.controller.getFinalCompleteValueAt(
        this.selectedIndex
      );

      // Whitelist the cases that we want to speculative connect, and ignore
      // other moz-action uris or fancy protocols.
      // Note that it's likely we've speculatively connected to the first
      // url because it is a heuristic "autofill" result (see bug 1348275).
      // "moz-action:searchengine" is also the same case. (see bug 1355443)
      // So we won't duplicate the effort here.
      if (url.startsWith("http") && this.selectedIndex > 0) {
        this.maybeSetupSpeculativeConnect(url);
      } else if (url.startsWith("moz-action:remotetab")) {
        // URL is in the format moz-action:ACTION,PARAMS
        // Where PARAMS is a JSON encoded object.
        const MOZ_ACTION_REGEX = /^moz-action:([^,]+),(.*)$/;
        if (!MOZ_ACTION_REGEX.test(url)) return;

        let params = JSON.parse(url.match(MOZ_ACTION_REGEX)[2]);
        if (params.url) {
          this.maybeSetupSpeculativeConnect(decodeURIComponent(params.url));
        }
      }
    });
  }

  set overrideValue(val) {
    this._overrideValue = val;
    return val;
  }

  get overrideValue() {
    return this._overrideValue;
  }

  get _isFirstResultHeuristic() {
    // The popup usually has a special "heuristic" first result (added
    // by UnifiedComplete.js) that is automatically selected when the
    // popup opens.
    return (
      this.input.mController.matchCount > 0 &&
      this.input.mController.getStyleAt(0).split(/\s+/).indexOf("heuristic") > 0
    );
  }

  set maxResults(val) {
    return (this._maxResults = parseInt(val));
  }

  get maxResults() {
    if (!this._maxResults) {
      this._maxResults = Services.prefs.getIntPref(
        "browser.urlbar.maxRichResults"
      );
    }
    return this._maxResults;
  }

  set margins(val) {
    if (val == this._margins) {
      return val;
    }

    if (
      val &&
      this._margins &&
      val.start == this._margins.start &&
      val.end == this._margins.end
    ) {
      return val;
    }

    this._margins = val;

    if (val) {
      let paddingInCSS =
        3 + // .autocomplete-richlistbox padding-left/right
        6 + // .ac-site-icon margin-inline-start
        16 + // .ac-site-icon width
        6; // .ac-site-icon margin-inline-end
      let actualVal = Math.round(val.start) - paddingInCSS;
      let actualValEnd = Math.round(val.end);
      this.style.setProperty("--item-padding-start", actualVal + "px");
      this.style.setProperty("--item-padding-end", actualValEnd + "px");
    } else {
      this.style.removeProperty("--item-padding-start");
      this.style.removeProperty("--item-padding-end");
    }
    for (let item of this.richlistbox.childNodes) {
      item.handleOverUnderflow();
    }
    return val;
  }

  get margins() {
    return this._margins;
  }

  get overrideSearchEngineName() {
    let button = this.oneOffSearchButtons.selectedButton;
    return button && button.engine && button.engine.name;
  }
  onPopupClick(aEvent) {
    if (aEvent.button == 2) {
      // Ignore right-clicks.
      return;
    }
    // Otherwise "call super" -- do what autocomplete-base-popup does.
    let controller = this.view.QueryInterface(
      Components.interfaces.nsIAutoCompleteController
    );
    controller.handleEnter(true, aEvent);
  }
  enableOneOffSearches(enable) {
    this._oneOffSearchesEnabled = enable;
    if (enable) {
      this.oneOffSearchButtons.telemetryOrigin = "urlbar";
      this.oneOffSearchButtons.style.display = "-moz-box";
      // Set .textbox first, since the popup setter will cause
      // a _rebuild call that uses it.
      this.oneOffSearchButtons.textbox = this.input;
      this.oneOffSearchButtons.popup = this;
    } else {
      this.oneOffSearchButtons.telemetryOrigin = null;
      this.oneOffSearchButtons.style.display = "none";
      this.oneOffSearchButtons.textbox = null;
      this.oneOffSearchButtons.popup = null;
    }
  }
  getNextIndex(reverse, amount, index, maxRow) {
    if (maxRow < 0) return -1;

    let newIndex = index + (reverse ? -1 : 1) * amount;

    // We only want to wrap if navigation is in any direction by one item,
    // otherwise we clamp to one end of the list.
    // ie, hitting page-down will only cause is to wrap if we're already
    // at one end of the list.

    // Allow the selection to be removed if the first result is not a
    // heuristic result.
    if (!this._isFirstResultHeuristic) {
      if ((reverse && index == -1) || (newIndex > maxRow && index != maxRow))
        newIndex = maxRow;
      else if ((!reverse && index == -1) || (newIndex < 0 && index != 0))
        newIndex = 0;

      if (
        (newIndex < 0 && index == 0) ||
        (newIndex > maxRow && index == maxRow)
      )
        newIndex = -1;

      return newIndex;
    }

    // Otherwise do not allow the selection to be removed.
    if (newIndex < 0) {
      newIndex = index > 0 ? 0 : maxRow;
    } else if (newIndex > maxRow) {
      newIndex = index < maxRow ? maxRow : 0;
    }
    return newIndex;
  }
  openAutocompletePopup(aInput, aElement) {
    // initially the panel is hidden
    // to avoid impacting startup / new window performance
    aInput.popup.hidden = false;

    this._openAutocompletePopup(aInput, aElement);
  }
  _openAutocompletePopup(aInput, aElement) {
    if (this.mPopupOpen) {
      return;
    }

    // Set the direction of the popup based on the textbox (bug 649840).
    // getComputedStyle causes a layout flush, so avoid calling it if a
    // direction has already been set.
    if (!this.style.direction) {
      this.style.direction = aElement.ownerGlobal.getComputedStyle(
        aElement
      ).direction;
    }
    let popupDirection = this.style.direction;

    // Make the popup span the width of the window.  First, set its width.
    let documentRect = this.DOMWindowUtils.getBoundsWithoutFlushing(
      window.document.documentElement
    );
    let width = documentRect.right - documentRect.left;
    this.setAttribute("width", width);

    // Now make its starting margin negative so that its leading edge
    // aligns with the window border.
    let elementRect = this.DOMWindowUtils.getBoundsWithoutFlushing(aElement);
    if (popupDirection == "rtl") {
      let offset = elementRect.right - documentRect.right;
      this.style.marginRight = offset + "px";
    } else {
      let offset = documentRect.left - elementRect.left;
      this.style.marginLeft = offset + "px";
    }

    // Keep the popup items' site icons aligned with the urlbar's identity
    // icon if it's not too far from the edge of the window.  We define
    // "too far" as "more than 30% of the window's width AND more than
    // 250px".  Do this *before* adding any items because when the new
    // value of the margins are different from the previous value, over-
    // and underflow must be handled for each item already in the popup.
    let boundToCheck = popupDirection == "rtl" ? "right" : "left";
    let inputRect = this.DOMWindowUtils.getBoundsWithoutFlushing(aInput);
    let startOffset = Math.abs(
      inputRect[boundToCheck] - documentRect[boundToCheck]
    );
    let alignSiteIcons = startOffset / width <= 0.3 || startOffset <= 250;
    if (alignSiteIcons) {
      // Calculate the end margin if we have a start margin.
      let boundToCheckEnd = popupDirection == "rtl" ? "left" : "right";
      let endOffset = Math.abs(
        inputRect[boundToCheckEnd] - documentRect[boundToCheckEnd]
      );
      if (endOffset > startOffset * 2) {
        // Provide more space when aligning would result in an unbalanced
        // margin. This allows the location bar to be moved to the start
        // of the navigation toolbar to reclaim space for results.
        endOffset = startOffset;
      }
      let identityIcon = document.getElementById("identity-icon");
      let identityRect = this.DOMWindowUtils.getBoundsWithoutFlushing(
        identityIcon
      );
      if (popupDirection == "rtl") {
        this.margins = {
          start: documentRect.right - identityRect.right,
          end: endOffset
        };
      } else {
        this.margins = {
          start: identityRect.left,
          end: endOffset
        };
      }
    } else {
      // Reset the alignment so that the site icons are positioned
      // according to whatever's in the CSS.
      this.margins = undefined;
    }

    // Now that the margins have been set, start adding items (via
    // _invalidate).
    this.mInput = aInput;
    aInput.controller.setInitiallySelectedIndex(
      this._isFirstResultHeuristic ? 0 : -1
    );
    this.view = aInput.controller.QueryInterface(
      Components.interfaces.nsITreeView
    );
    this._invalidate();

    try {
      let whichNotification = aInput.whichSearchSuggestionsNotification;
      if (whichNotification != "none") {
        // Update the impressions count on real popupshown, since there's
        // no guarantee openPopup will be respected by the platform.
        // Though, we must ensure the handled event is the expected one.
        let impressionId = (this._searchSuggestionsImpressionId = {});
        this.addEventListener(
          "popupshown",
          () => {
            if (this._searchSuggestionsImpressionId == impressionId)
              aInput.updateSearchSuggestionsNotificationImpressions(
                whichNotification
              );
          },
          { once: true }
        );
        this._showSearchSuggestionsNotification(
          whichNotification,
          popupDirection
        );
      } else if (this.classList.contains("showSearchSuggestionsNotification")) {
        this._hideSearchSuggestionsNotification();
      }
    } catch (ex) {
      // Not critical for the urlbar functionality, just report the error.
      Components.utils.reportError(ex);
    }

    // Position the popup below the navbar.  To get the y-coordinate,
    // which is an offset from the bottom of the input, subtract the
    // bottom of the navbar from the buttom of the input.
    let yOffset = Math.round(
      this.DOMWindowUtils.getBoundsWithoutFlushing(
        document.getElementById("nav-bar")
      ).bottom - this.DOMWindowUtils.getBoundsWithoutFlushing(aInput).bottom
    );

    this.openPopup(aElement, "after_start", 0, yOffset, false, false);
  }
  _showSearchSuggestionsNotification(whichNotification, popupDirection) {
    if (whichNotification == "opt-out") {
      if (this.margins) {
        this.searchSuggestionsNotification.style.paddingInlineStart =
          this.margins.start + "px";
      } else {
        this.searchSuggestionsNotification.style.removeProperty(
          "padding-inline-start"
        );
      }

      // We want to animate the opt-out hint only once.
      if (!this._firstSearchSuggestionsNotification) {
        this._firstSearchSuggestionsNotification = true;
        this.searchSuggestionsNotification.setAttribute("animate", "true");
      }
    }

    this.searchSuggestionsNotification.setAttribute(
      "aria-describedby",
      "search-suggestions-hint"
    );

    // With the notification shown, the listbox's height can sometimes be
    // too small when it's flexed, as it normally is.  Also, it can start
    // out slightly scrolled down.  Both problems appear together, most
    // often when the popup is very narrow and the notification's text
    // must wrap.  Work around them by removing the flex.
    //
    // But without flexing the listbox, the listbox's height animation
    // sometimes fails to complete, leaving the popup too tall.  Work
    // around that problem by disabling the listbox animation.
    this.richlistbox.flex = 0;
    this.setAttribute("dontanimate", "true");

    this.classList.add("showSearchSuggestionsNotification");
    // Don't show the one-off buttons if we are showing onboarding and
    // there's no result, since it would be ugly and pointless.
    this.footer.collapsed = this._matchCount == 0;
    this.input.tabScrolling = this._matchCount != 0;

    // This event allows accessibility APIs to see the notification.
    if (!this.popupOpen) {
      let event = document.createEvent("Events");
      event.initEvent("AlertActive", true, true);
      this.searchSuggestionsNotification.dispatchEvent(event);
    }
  }
  _hideSearchSuggestionsNotification() {
    this.classList.remove("showSearchSuggestionsNotification");
    this.richlistbox.flex = 1;
    this.removeAttribute("dontanimate");
    this.searchSuggestionsNotification.removeAttribute("animate");
    if (this._matchCount) {
      // Update popup height.
      this._invalidate();
    } else {
      this.closePopup();
    }
  }
  _selectedOneOffChanged() {
    // Update all searchengine result items to use the newly selected
    // engine.
    for (let item of this.richlistbox.childNodes) {
      if (item.collapsed) {
        break;
      }
      let url = item.getAttribute("url");
      if (url) {
        let action = item._parseActionUrl(url);
        if (action && action.type == "searchengine") {
          item._adjustAcItem();
        }
      }
    }
  }
  handleKeyPress(aEvent) {
    this.oneOffSearchButtons.handleKeyPress(
      aEvent,
      this._matchCount,
      !this._isFirstResultHeuristic,
      gBrowser.userTypedValue
    );
    return aEvent.defaultPrevented && !aEvent.urlbarDeferred;
  }
  handleOneOffSearch(event, engine, where, params) {
    this.input.handleCommand(event, where, params);
  }
  createResultLabel(item, proposedLabel) {
    let parts = [proposedLabel];

    let action = this.mInput._parseActionUrl(item.getAttribute("url"));
    if (action) {
      switch (action.type) {
        case "searchengine":
          parts = [
            action.params.searchSuggestion || action.params.searchQuery,
            action.params.engineName
          ];
          break;
        case "switchtab":
        case "remotetab":
          parts = [item.getAttribute("title"), item.getAttribute("displayurl")];
          break;
      }
    }

    let types = item.getAttribute("type").split(/\s+/);
    let type = types.find(t => t != "action" && t != "heuristic");
    try {
      // Some types intentionally do not map to strings, which is not
      // an error.
      parts.push(this._bundle.GetStringFromName(type + "ResultLabel"));
    } catch (e) {}

    return parts.filter(str => str).join(" ");
  }
  maybeSetupSpeculativeConnect(aUriString) {
    try {
      let uri = makeURI(aUriString);
      Services.io.speculativeConnect2(uri, gBrowser.contentPrincipal, null);
    } catch (ex) {
      // Can't setup speculative connection for this uri string for some
      // reason, just ignore it.
    }
  }
  onResultsAdded() {
    // If nothing is selected yet, select the first result if it is a
    // pre-selected "heuristic" result.  (See UnifiedComplete.js.)
    if (this.selectedIndex == -1 && this._isFirstResultHeuristic) {
      // Don't fire DOMMenuItemActive so that screen readers still see
      // the input as being focused.
      this.richlistbox.suppressMenuItemEvent = true;
      this.input.controller.setInitiallySelectedIndex(0);
      this.richlistbox.suppressMenuItemEvent = false;
    }
    // If this is the first time we get the result from the current
    // search and we are not in the private context, we can speculatively
    // connect to the intended site as a performance optimization.
    if (
      !this.input.gotResultForCurrentQuery &&
      this.input.speculativeConnectEnabled &&
      !this.input.inPrivateContext &&
      this.input.mController.matchCount > 0
    ) {
      let firstStyle = this.input.mController.getStyleAt(0);
      if (firstStyle.includes("autofill")) {
        let uri = this.input.mController.getFinalCompleteValueAt(0);
        // "http" will be stripped out, but other scheme won't.
        if (!uri.includes("://")) {
          uri = "http://" + uri;
        }
        this.maybeSetupSpeculativeConnect(uri);
      } else if (
        firstStyle.includes("searchengine") &&
        this.input.browserSearchSuggestEnabled &&
        this.input.urlbarSearchSuggestEnabled
      ) {
        // Preconnect to the current search engine only if the search
        // suggestions are enabled.
        let engine = Services.search.currentEngine;
        engine.speculativeConnect({
          window,
          originAttributes: gBrowser.contentPrincipal.originAttributes
        });
      }
    }

    // When a result is present the footer should always be visible.
    this.footer.collapsed = false;
    this.input.tabScrolling = true;

    this.input.gotResultForCurrentQuery = true;
    this.input.maybeReplayDeferredKeyEvents();
  }
  _onSearchBegin() {
    // Set the selected index to 0 (heuristic) until a result comes back
    // and we can evaluate it better.
    //
    // This is required to properly manage delayed handleEnter:
    // 1. if a search starts we set selectedIndex to 0 here, and it will
    //    be updated by onResultsAdded. Since selectedIndex is 0,
    //    handleEnter will delay the action if a result didn't arrive yet.
    // 2. if a search doesn't start (for example if autocomplete is
    //    disabled), this won't be called, and the selectedIndex will be
    //    the default -1 value. Then handleEnter will know it should not
    //    delay the action, cause a result wont't ever arrive.
    this.input.controller.setInitiallySelectedIndex(0);

    // Since we are starting a new search, reset the currently selected
    // one-off button, to cover those cases where the oneoff buttons
    // binding won't receive an actual DOM event. For example, a search
    // could be started without an actual input event, and the popup may
    // not have been closed from the previous search.
    this.oneOffSearchButtons.selectedButton = null;
  }
  initAddonIframe(owner, overrides) {
    if (this._addonIframeOwner) {
      // Another add-on has already requested the iframe.  Return null to
      // signal to the calling add-on that it should not take over the
      // popup.  First add-on wins for now.
      return null;
    }
    // Make sure all overrides are provided before doing anything.
    for (let name of this._addonIframeOverrideFunctionNames) {
      if (typeof overrides[name] != "function") {
        throw new Error("Override for method '" + name + "' must be given");
      }
    }
    // OK, insert the iframe.
    this._addonIframeOwner = owner;
    this._addonIframe = this._makeAddonIframe();
    this._addonIframeOverriddenFunctionsByName = {};
    for (let name of this._addonIframeOverrideFunctionNames) {
      this._addonIframeOverriddenFunctionsByName[name] = this[name];
      this[name] = overrides[name];
    }
    return this._addonIframe;
  }
  destroyAddonIframe(owner) {
    if (this._addonIframeOwner != owner) {
      throw new Error("You're not the iframe owner");
    }
    this._addonIframeOwner = null;
    this._addonIframe.remove();
    this._addonIframe = null;
    for (let anonid of this._addonIframeHiddenAnonids) {
      let child = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        anonid
      );
      child.style.display = this._addonIframeHiddenDisplaysByAnonid[anonid];
    }
    for (let name in this._addonIframeOverriddenFunctionsByName) {
      this[name] = this._addonIframeOverriddenFunctionsByName[name];
    }
    this._addonIframeOverriddenFunctionsByName = {};
  }
  _makeAddonIframe() {
    this._addonIframeHiddenDisplaysByAnonid = {};
    for (let anonid of this._addonIframeHiddenAnonids) {
      let child = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        anonid
      );
      this._addonIframeHiddenDisplaysByAnonid[anonid] = child.style.display;
      child.style.display = "none";
    }
    let XUL_NS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    let iframe = document.createElementNS(XUL_NS, "iframe");
    iframe.setAttribute("type", "content");
    iframe.setAttribute("flex", "1");
    iframe.style.transition = "height 100ms";
    this.appendChild(iframe);
    return iframe;
  }
}
customElements.define(
  "firefox-urlbar-rich-result-popup",
  FirefoxUrlbarRichResultPopup
);
