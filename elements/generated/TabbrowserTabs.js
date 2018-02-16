class FirefoxTabbrowserTabs extends FirefoxTabs {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="tab-drop-indicator-box">
        <xul:image class="tab-drop-indicator" anonid="tab-drop-indicator" collapsed="true"></xul:image>
      </xul:hbox>
      <xul:arrowscrollbox anonid="arrowscrollbox" orient="horizontal" flex="1" style="min-width: 1px;" class="tabbrowser-arrowscrollbox">
        <children includes="tab"></children>
        <children></children>
        <xul:toolbarbutton class="tabs-newtab-button toolbarbutton-1" anonid="tabs-newtab-button" command="cmd_newNavigatorTab" onclick="checkForMiddleClick(this, event);" tooltip="dynamic-shortcut-tooltip"></xul:toolbarbutton>
        <xul:hbox class="restore-tabs-button-wrapper" anonid="restore-tabs-button-wrapper">
          <xul:toolbarbutton anonid="restore-tabs-button" class="restore-tabs-button" onclick="SessionStore.restoreLastSession();"></xul:toolbarbutton>
        </xul:hbox>
        <xul:spacer class="closing-tabs-spacer" anonid="closing-tabs-spacer" style="width: 0;"></xul:spacer>
      </xul:arrowscrollbox>
    `;

    this.tabbrowser = document.getElementById(this.getAttribute("tabbrowser"));

    this.tabbox = this.tabbrowser.tabbox;

    this.contextMenu = document.getElementById("tabContextMenu");

    this.arrowScrollbox = document.getAnonymousElementByAttribute(this, "anonid", "arrowscrollbox");

    this._firstTab = null;

    this._lastTab = null;

    this._beforeSelectedTab = null;

    this._beforeHoveredTab = null;

    this._afterHoveredTab = null;

    this._hoveredTab = null;

    this.restoreTabsButton = document.getAnonymousElementByAttribute(this, "anonid", "restore-tabs-button");

    this._restoreTabsButtonWrapperWidth = 0;

    this.windowUtils = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);

    this._blockDblClick = false;

    this._tabDropIndicator = document.getAnonymousElementByAttribute(this, "anonid", "tab-drop-indicator");

    this._dragOverDelay = 350;

    this._dragTime = 0;

    this._container = this.parentNode && this.parentNode.localName == "toolbar" ? this.parentNode : this;

    this._propagatedVisibilityOnce = false;

    this._closeButtonsUpdatePending = false;

    this._closingTabsSpacer = document.getAnonymousElementByAttribute(this, "anonid", "closing-tabs-spacer");

    this._tabDefaultMaxWidth = NaN;

    this._lastTabClosedByMouse = false;

    this._hasTabTempMaxWidth = false;

    this._lastNumPinned = 0;

    this._pinnedTabsLayoutCache = null;

    this._animateElement = this.arrowScrollbox._scrollButtonDown;

    this._tabClipWidth = Services.prefs.getIntPref("browser.tabs.tabClipWidth");

    let {
      restoreTabsButton
    } = this;
    restoreTabsButton.setAttribute("label", gTabBrowserBundle.GetStringFromName("tabs.restoreLastTabs"));

    var tab = this.firstChild;
    tab.label = gTabBrowserBundle.GetStringFromName("tabs.emptyTabTitle");
    tab.setAttribute("onerror", "this.removeAttribute('image');");

    window.addEventListener("resize", this);
    window.addEventListener("DOMContentLoaded", this);

    Services.prefs.addObserver("privacy.userContext", this);
    this.observe(null, "nsPref:changed", "privacy.userContext.enabled");

    this._setPositionalAttributes();

    this.setupHandlers();
  }

  get restoreTabsButtonWrapperWidth() {
    if (!this._restoreTabsButtonWrapperWidth) {
      this._restoreTabsButtonWrapperWidth = this.windowUtils
        .getBoundsWithoutFlushing(this.restoreTabsButton.parentNode)
        .width;
    }
    return this._restoreTabsButtonWrapperWidth;
  }

  get _isCustomizing() {
    return document.documentElement.getAttribute("customizing") == "true";
  }

  set visible(val) {
    if (val == this.visible &&
      this._propagatedVisibilityOnce)
      return val;

    this._container.collapsed = !val;

    this._propagateVisibility();
    this._propagatedVisibilityOnce = true;

    return val;
  }

  get visible() {
    return !this._container.collapsed;
  }
  updateSessionRestoreVisibility() {
    let {
      restoreTabsButton,
      restoreTabsButtonWrapperWidth,
      windowUtils
    } = this;
    let restoreTabsButtonWrapper = restoreTabsButton.parentNode;

    if (!restoreTabsButtonWrapper.getAttribute("session-exists")) {
      restoreTabsButtonWrapper.removeAttribute("shown");
      return;
    }

    let arrowScrollboxWidth = this.arrowScrollbox.clientWidth;

    let newTabButton = document.getAnonymousElementByAttribute(
      this, "anonid", "tabs-newtab-button");

    // If there are no pinned tabs it will multiply by 0 and result in 0
    let pinnedTabsWidth = windowUtils.getBoundsWithoutFlushing(this.firstChild).width * this._lastNumPinned;

    let numUnpinnedTabs = this.childNodes.length - this._lastNumPinned;
    let unpinnedTabsWidth = windowUtils.getBoundsWithoutFlushing(this.lastChild).width * numUnpinnedTabs;

    let tabbarUsedSpace = pinnedTabsWidth + unpinnedTabsWidth +
      windowUtils.getBoundsWithoutFlushing(newTabButton).width;

    // Subtract the elements' widths from the available space to ensure
    // that showing the restoreTabsButton won't cause any overflow.
    if (arrowScrollboxWidth - tabbarUsedSpace > restoreTabsButtonWrapperWidth) {
      restoreTabsButtonWrapper.setAttribute("shown", "true");
    } else {
      restoreTabsButtonWrapper.removeAttribute("shown");
    }
  }
  observe(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "nsPref:changed":
        // This is has to deal with changes in
        // privacy.userContext.enabled and
        // privacy.userContext.longPressBehavior.
        let containersEnabled = Services.prefs.getBoolPref("privacy.userContext.enabled") &&
          !PrivateBrowsingUtils.isWindowPrivate(window);

        // This pref won't change so often, so just recreate the menu.
        let longPressBehavior = Services.prefs.getIntPref("privacy.userContext.longPressBehavior");

        // If longPressBehavior pref is set to 0 (or any invalid value)
        // long press menu is disabled.
        if (containersEnabled && (longPressBehavior <= 0 || longPressBehavior > 2)) {
          containersEnabled = false;
        }

        const newTab = document.getElementById("new-tab-button");
        const newTab2 = document.getAnonymousElementByAttribute(this, "anonid", "tabs-newtab-button");

        for (let parent of [newTab, newTab2]) {
          if (!parent)
            continue;

          gClickAndHoldListenersOnElement.remove(parent);
          parent.removeAttribute("type");
          if (parent.firstChild) {
            parent.firstChild.remove();
          }

          if (containersEnabled) {
            let popup = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menupopup");
            if (parent.id) {
              popup.id = "newtab-popup";
            } else {
              popup.setAttribute("anonid", "newtab-popup");
            }
            popup.className = "new-tab-popup";
            popup.setAttribute("position", "after_end");
            parent.appendChild(popup);

            // longPressBehavior == 2 means that the menu is shown after X
            // millisecs. Otherwise, with 1, the menu is open immediatelly.
            if (longPressBehavior == 2) {
              gClickAndHoldListenersOnElement.add(parent);
            }

            parent.setAttribute("type", "menu");
          }
        }

        break;
    }
  }
  _setPositionalAttributes() {
    let visibleTabs = this.tabbrowser.visibleTabs;

    if (!visibleTabs.length)
      return;

    let selectedIndex = visibleTabs.indexOf(this.selectedItem);

    if (this._beforeSelectedTab) {
      this._beforeSelectedTab.removeAttribute("beforeselected-visible");
    }

    if (this.selectedItem.closing || selectedIndex == 0) {
      this._beforeSelectedTab = null;
    } else {
      let beforeSelectedTab = visibleTabs[selectedIndex - 1];
      let separatedByScrollButton = this.getAttribute("overflow") == "true" &&
        beforeSelectedTab.pinned && !this.selectedItem.pinned;
      if (!separatedByScrollButton) {
        this._beforeSelectedTab = beforeSelectedTab;
        this._beforeSelectedTab.setAttribute("beforeselected-visible",
          "true");
      }
    }

    if (this._firstTab)
      this._firstTab.removeAttribute("first-visible-tab");
    this._firstTab = visibleTabs[0];
    this._firstTab.setAttribute("first-visible-tab", "true");
    if (this._lastTab)
      this._lastTab.removeAttribute("last-visible-tab");
    this._lastTab = visibleTabs[visibleTabs.length - 1];
    this._lastTab.setAttribute("last-visible-tab", "true");

    let hoveredTab = this._hoveredTab;
    if (hoveredTab) {
      hoveredTab._mouseleave();
    }
    hoveredTab = this.querySelector("tab:hover");
    if (hoveredTab) {
      hoveredTab._mouseenter();
    }
  }
  _propagateVisibility() {
    let visible = this.visible;

    document.getElementById("menu_closeWindow").hidden = !visible;
    document.getElementById("menu_close").setAttribute("label",
      gTabBrowserBundle.GetStringFromName(visible ? "tabs.closeTab" : "tabs.close"));

    TabsInTitlebar.allowedBy("tabs-visible", visible);
  }
  updateVisibility() {
    if (this.childNodes.length - this.tabbrowser._removingTabs.length == 1)
      this.visible = window.toolbar.visible;
    else
      this.visible = true;
  }
  _updateCloseButtons() {
    // If we're overflowing, tabs are at their minimum widths.
    if (this.getAttribute("overflow") == "true") {
      this.setAttribute("closebuttons", "activetab");
      return;
    }

    if (this._closeButtonsUpdatePending) {
      return;
    }
    this._closeButtonsUpdatePending = true;

    // Wait until after the next paint to get current layout data from
    // getBoundsWithoutFlushing.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this._closeButtonsUpdatePending = false;

        // The scrollbox may have started overflowing since we checked
        // overflow earlier, so check again.
        if (this.getAttribute("overflow") == "true") {
          this.setAttribute("closebuttons", "activetab");
          return;
        }

        // Check if tab widths are below the threshold where we want to
        // remove close buttons from background tabs so that people don't
        // accidentally close tabs by selecting them.
        let rect = ele => {
          return window.QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindowUtils)
            .getBoundsWithoutFlushing(ele);
        };
        let tab = this.tabbrowser.visibleTabs[this.tabbrowser._numPinnedTabs];
        if (tab && rect(tab).width <= this._tabClipWidth) {
          this.setAttribute("closebuttons", "activetab");
        } else {
          this.removeAttribute("closebuttons");
        }
      });
    });
  }
  _handleTabSelect(aInstant) {
    if (this.getAttribute("overflow") == "true")
      this.arrowScrollbox.ensureElementIsVisible(this.selectedItem, aInstant);

    this.selectedItem._notselectedsinceload = false;
  }
  _lockTabSizing(aTab) {
    var tabs = this.tabbrowser.visibleTabs;
    if (!tabs.length)
      return;

    var isEndTab = (aTab._tPos > tabs[tabs.length - 1]._tPos);
    var tabWidth = aTab.getBoundingClientRect().width;

    if (!this._tabDefaultMaxWidth)
      this._tabDefaultMaxWidth =
      parseFloat(window.getComputedStyle(aTab).maxWidth);
    this._lastTabClosedByMouse = true;

    if (this.getAttribute("overflow") == "true") {
      // Don't need to do anything if we're in overflow mode and aren't scrolled
      // all the way to the right, or if we're closing the last tab.
      if (isEndTab || !this.arrowScrollbox._scrollButtonDown.disabled)
        return;

      // If the tab has an owner that will become the active tab, the owner will
      // be to the left of it, so we actually want the left tab to slide over.
      // This can't be done as easily in non-overflow mode, so we don't bother.
      if (aTab.owner)
        return;

      this._expandSpacerBy(tabWidth);
    } else { // non-overflow mode
      // Locking is neither in effect nor needed, so let tabs expand normally.
      if (isEndTab && !this._hasTabTempMaxWidth)
        return;

      let numPinned = this.tabbrowser._numPinnedTabs;
      // Force tabs to stay the same width, unless we're closing the last tab,
      // which case we need to let them expand just enough so that the overall
      // tabbar width is the same.
      if (isEndTab) {
        let numNormalTabs = tabs.length - numPinned;
        tabWidth = tabWidth * (numNormalTabs + 1) / numNormalTabs;
        if (tabWidth > this._tabDefaultMaxWidth)
          tabWidth = this._tabDefaultMaxWidth;
      }
      tabWidth += "px";
      for (let i = numPinned; i < tabs.length; i++) {
        let tab = tabs[i];
        tab.style.setProperty("max-width", tabWidth, "important");
        if (!isEndTab) { // keep tabs the same width
          tab.style.transition = "none";
          tab.clientTop; // flush styles to skip animation; see bug 649247
          tab.style.transition = "";
        }
      }
      this._hasTabTempMaxWidth = true;
      this.tabbrowser.addEventListener("mousemove", this);
      window.addEventListener("mouseout", this);
    }
  }
  _expandSpacerBy(pixels) {
    let spacer = this._closingTabsSpacer;
    spacer.style.width = parseFloat(spacer.style.width) + pixels + "px";
    this.setAttribute("using-closing-tabs-spacer", "true");
    this.tabbrowser.addEventListener("mousemove", this);
    window.addEventListener("mouseout", this);
  }
  _unlockTabSizing() {
    this.tabbrowser.removeEventListener("mousemove", this);
    window.removeEventListener("mouseout", this);

    if (this._hasTabTempMaxWidth) {
      this._hasTabTempMaxWidth = false;
      let tabs = this.tabbrowser.visibleTabs;
      for (let i = 0; i < tabs.length; i++)
        tabs[i].style.maxWidth = "";
    }

    if (this.hasAttribute("using-closing-tabs-spacer")) {
      this.removeAttribute("using-closing-tabs-spacer");
      this._closingTabsSpacer.style.width = 0;
    }
  }
  uiDensityChanged() {
    this._positionPinnedTabs();
    this._updateCloseButtons();
    this._handleTabSelect(true);
  }
  _positionPinnedTabs() {
    var numPinned = this.tabbrowser._numPinnedTabs;
    var doPosition = this.getAttribute("overflow") == "true" &&
      numPinned > 0;

    if (doPosition) {
      this.setAttribute("positionpinnedtabs", "true");

      let layoutData = this._pinnedTabsLayoutCache;
      let uiDensity = document.documentElement.getAttribute("uidensity");
      if (!layoutData ||
        layoutData.uiDensity != uiDensity) {
        let arrowScrollbox = this.arrowScrollbox;
        layoutData = this._pinnedTabsLayoutCache = {
          uiDensity,
          pinnedTabWidth: this.childNodes[0].getBoundingClientRect().width,
          scrollButtonWidth: arrowScrollbox._scrollButtonDown.getBoundingClientRect().width
        };
      }

      let width = 0;
      for (let i = numPinned - 1; i >= 0; i--) {
        let tab = this.childNodes[i];
        width += layoutData.pinnedTabWidth;
        tab.style.marginInlineStart = -(width + layoutData.scrollButtonWidth) + "px";
      }
      this.style.paddingInlineStart = width + "px";
    } else {
      this.removeAttribute("positionpinnedtabs");

      for (let i = 0; i < numPinned; i++) {
        let tab = this.childNodes[i];
        tab.style.marginInlineStart = "";
      }

      this.style.paddingInlineStart = "";
    }

    if (this._lastNumPinned != numPinned) {
      this._lastNumPinned = numPinned;
      this._handleTabSelect(true);
    }
  }
  _animateTabMove(event) {
    let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);

    if (this.getAttribute("movingtab") != "true") {
      this.setAttribute("movingtab", "true");
      this.parentNode.setAttribute("movingtab", "true");
      this.selectedItem = draggedTab;
    }

    if (!("animLastScreenX" in draggedTab._dragData))
      draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;

    let screenX = event.screenX;
    if (screenX == draggedTab._dragData.animLastScreenX)
      return;

    draggedTab._dragData.animLastScreenX = screenX;

    let rtl = (window.getComputedStyle(this).direction == "rtl");
    let pinned = draggedTab.pinned;
    let numPinned = this.tabbrowser._numPinnedTabs;
    let tabs = this.tabbrowser.visibleTabs
      .slice(pinned ? 0 : numPinned,
        pinned ? numPinned : undefined);
    if (rtl)
      tabs.reverse();
    let tabWidth = draggedTab.getBoundingClientRect().width;
    draggedTab._dragData.tabWidth = tabWidth;

    // Move the dragged tab based on the mouse position.

    let leftTab = tabs[0];
    let rightTab = tabs[tabs.length - 1];
    let tabScreenX = draggedTab.boxObject.screenX;
    let translateX = screenX - draggedTab._dragData.screenX;
    if (!pinned)
      translateX += this.arrowScrollbox._scrollbox.scrollLeft - draggedTab._dragData.scrollX;
    let leftBound = leftTab.boxObject.screenX - tabScreenX;
    let rightBound = (rightTab.boxObject.screenX + rightTab.boxObject.width) -
      (tabScreenX + tabWidth);
    translateX = Math.max(translateX, leftBound);
    translateX = Math.min(translateX, rightBound);
    draggedTab.style.transform = "translateX(" + translateX + "px)";
    draggedTab._dragData.translateX = translateX;

    // Determine what tab we're dragging over.
    // * Point of reference is the center of the dragged tab. If that
    //   point touches a background tab, the dragged tab would take that
    //   tab's position when dropped.
    // * We're doing a binary search in order to reduce the amount of
    //   tabs we need to check.

    let tabCenter = tabScreenX + translateX + tabWidth / 2;
    let newIndex = -1;
    let oldIndex = "animDropIndex" in draggedTab._dragData ?
      draggedTab._dragData.animDropIndex : draggedTab._tPos;
    let low = 0;
    let high = tabs.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (tabs[mid] == draggedTab &&
        ++mid > high)
        break;
      let boxObject = tabs[mid].boxObject;
      screenX = boxObject.screenX + getTabShift(tabs[mid], oldIndex);
      if (screenX > tabCenter) {
        high = mid - 1;
      } else if (screenX + boxObject.width < tabCenter) {
        low = mid + 1;
      } else {
        newIndex = tabs[mid]._tPos;
        break;
      }
    }
    if (newIndex >= oldIndex)
      newIndex++;
    if (newIndex < 0 || newIndex == oldIndex)
      return;
    draggedTab._dragData.animDropIndex = newIndex;

    // Shift background tabs to leave a gap where the dragged tab
    // would currently be dropped.

    for (let tab of tabs) {
      if (tab != draggedTab) {
        let shift = getTabShift(tab, newIndex);
        tab.style.transform = shift ? "translateX(" + shift + "px)" : "";
      }
    }

    function getTabShift(tab, dropIndex) {
      if (tab._tPos < draggedTab._tPos && tab._tPos >= dropIndex)
        return rtl ? -tabWidth : tabWidth;
      if (tab._tPos > draggedTab._tPos && tab._tPos < dropIndex)
        return rtl ? tabWidth : -tabWidth;
      return 0;
    }
  }
  _finishAnimateTabMove() {
    if (this.getAttribute("movingtab") != "true")
      return;

    for (let tab of this.tabbrowser.visibleTabs)
      tab.style.transform = "";

    this.removeAttribute("movingtab");
    this.parentNode.removeAttribute("movingtab");

    this._handleTabSelect();
  }
  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "DOMContentLoaded":
        this.updateVisibility();
        TabsInTitlebar.init();
        break;
      case "resize":
        if (aEvent.target != window)
          break;

        TabsInTitlebar.updateAppearance();
        this._updateCloseButtons();
        this._handleTabSelect(true);
        this.updateSessionRestoreVisibility();
        break;
      case "mouseout":
        // If the "related target" (the node to which the pointer went) is not
        // a child of the current document, the mouse just left the window.
        let relatedTarget = aEvent.relatedTarget;
        if (relatedTarget && relatedTarget.ownerDocument == document)
          break;
      case "mousemove":
        if (document.getElementById("tabContextMenu").state != "open")
          this._unlockTabSizing();
        break;
    }
  }
  _notifyBackgroundTab(aTab) {
    if (aTab.pinned || aTab.hidden)
      return;

    var scrollRect = this.arrowScrollbox.scrollClientRect;
    var tab = aTab.getBoundingClientRect();

    // DOMRect left/right properties are immutable.
    tab = {
      left: tab.left,
      right: tab.right
    };

    // Is the new tab already completely visible?
    if (scrollRect.left <= tab.left && tab.right <= scrollRect.right)
      return;

    if (this.arrowScrollbox.smoothScroll) {
      let selected = !this.selectedItem.pinned &&
        this.selectedItem.getBoundingClientRect();

      // Can we make both the new tab and the selected tab completely visible?
      if (!selected ||
        Math.max(tab.right - selected.left, selected.right - tab.left) <=
        scrollRect.width) {
        this.arrowScrollbox.ensureElementIsVisible(aTab);
        return;
      }

      this.arrowScrollbox.scrollByPixels(this.arrowScrollbox._isRTLScrollbox ?
        selected.right - scrollRect.right :
        selected.left - scrollRect.left);
    }

    if (!this._animateElement.hasAttribute("highlight")) {
      this._animateElement.setAttribute("highlight", "true");
      setTimeout(function(ele) {
        ele.removeAttribute("highlight");
      }, 150, this._animateElement);
    }
  }
  _getDragTargetTab(event, isLink) {
    let tab = event.target.localName == "tab" ? event.target : null;
    if (tab && isLink) {
      let boxObject = tab.boxObject;
      if (event.screenX < boxObject.screenX + boxObject.width * .25 ||
        event.screenX > boxObject.screenX + boxObject.width * .75)
        return null;
    }
    return tab;
  }
  _getDropIndex(event, isLink) {
    var tabs = this.childNodes;
    var tab = this._getDragTargetTab(event, isLink);
    if (window.getComputedStyle(this).direction == "ltr") {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (event.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
          return i;
    } else {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (event.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
          return i;
    }
    return tabs.length;
  }
  _getDropEffectForTabDrag(event) {
    var dt = event.dataTransfer;
    if (dt.mozItemCount == 1) {
      var types = dt.mozTypesAt(0);
      // tabs are always added as the first type
      if (types[0] == TAB_DROP_TYPE) {
        let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (sourceNode instanceof XULElement &&
          sourceNode.localName == "tab" &&
          sourceNode.ownerGlobal.isChromeWindow &&
          sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser" &&
          sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.parentNode) {
          // Do not allow transfering a private tab to a non-private window
          // and vice versa.
          if (PrivateBrowsingUtils.isWindowPrivate(window) !=
            PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal))
            return "none";

          if (window.gMultiProcessBrowser !=
            sourceNode.ownerGlobal.gMultiProcessBrowser)
            return "none";

          return dt.dropEffect == "copy" ? "copy" : "move";
        }
      }
    }

    if (browserDragAndDrop.canDropLink(event)) {
      return "link";
    }
    return "none";
  }
  _handleNewTab(tab) {
    if (tab.parentNode != this)
      return;
    tab._fullyOpen = true;
    this.tabbrowser.tabAnimationsInProgress--;

    this._updateCloseButtons();

    if (tab.getAttribute("selected") == "true") {
      this._handleTabSelect();
    } else if (!tab.hasAttribute("skipbackgroundnotify")) {
      this._notifyBackgroundTab(tab);
    }

    // XXXmano: this is a temporary workaround for bug 345399
    // We need to manually update the scroll buttons disabled state
    // if a tab was inserted to the overflow area or removed from it
    // without any scrolling and when the tabbar has already
    // overflowed.
    this.arrowScrollbox._updateScrollButtonsDisabledState();

    // Preload the next about:newtab if there isn't one already.
    this.tabbrowser._createPreloadBrowser();
  }
  _canAdvanceToTab(aTab) {
    return !aTab.closing;
  }
  getRelatedElement(aTab) {
    if (!aTab)
      return null;
    // If the tab's browser is lazy, we need to `_insertBrowser` in order
    // to have a linkedPanel.  This will also serve to bind the browser
    // and make it ready to use when the tab is selected.
    this.tabbrowser._insertBrowser(aTab);
    return document.getElementById(aTab.linkedPanel);
  }
  disconnectedCallback() {
    Services.prefs.removeObserver("privacy.userContext", this);
  }

  setupHandlers() {

    this.addEventListener("TabSelect", (event) => {
      this._handleTabSelect();
    });

    this.addEventListener("transitionend", (event) => {
      if (event.propertyName != "max-width")
        return;

      var tab = event.target;

      if (tab.getAttribute("fadein") == "true") {
        if (tab._fullyOpen)
          this._updateCloseButtons();
        else
          this._handleNewTab(tab);
      } else if (tab.closing) {
        this.tabbrowser._endRemoveTab(tab);
      }
    });

    this.addEventListener("dblclick", (event) => {
      // When the tabbar has an unified appearance with the titlebar
      // and menubar, a double-click in it should have the same behavior
      // as double-clicking the titlebar
      if (TabsInTitlebar.enabled || this.parentNode._dragBindingAlive)
        return;

      if (event.button != 0 ||
        event.originalTarget.localName != "box")
        return;

      if (!this._blockDblClick)
        BrowserOpenTab();

      event.preventDefault();
    });

    this.addEventListener("click", (event) => {
      /* Catches extra clicks meant for the in-tab close button.
       * Placed here to avoid leaking (a temporary handler added from the
       * in-tab close button binding would close over the tab and leak it
       * until the handler itself was removed). (bug 897751)
       *
       * The only sequence in which a second click event (i.e. dblclik)
       * can be dispatched on an in-tab close button is when it is shown
       * after the first click (i.e. the first click event was dispatched
       * on the tab). This happens when we show the close button only on
       * the active tab. (bug 352021)
       * The only sequence in which a third click event can be dispatched
       * on an in-tab close button is when the tab was opened with a
       * double click on the tabbar. (bug 378344)
       * In both cases, it is most likely that the close button area has
       * been accidentally clicked, therefore we do not close the tab.
       *
       * We don't want to ignore processing of more than one click event,
       * though, since the user might actually be repeatedly clicking to
       * close many tabs at once.
       */
      let target = event.originalTarget;
      if (target.classList.contains("tab-close-button")) {
        // We preemptively set this to allow the closing-multiple-tabs-
        // in-a-row case.
        if (this._blockDblClick) {
          target._ignoredCloseButtonClicks = true;
        } else if (event.detail > 1 && !target._ignoredCloseButtonClicks) {
          target._ignoredCloseButtonClicks = true;
          event.stopPropagation();
          return;
        } else {
          // Reset the "ignored click" flag
          target._ignoredCloseButtonClicks = false;
        }
      }

      /* Protects from close-tab-button errant doubleclick:
       * Since we're removing the event target, if the user
       * double-clicks the button, the dblclick event will be dispatched
       * with the tabbar as its event target (and explicit/originalTarget),
       * which treats that as a mouse gesture for opening a new tab.
       * In this context, we're manually blocking the dblclick event.
       */
      if (this._blockDblClick) {
        if (!("_clickedTabBarOnce" in this)) {
          this._clickedTabBarOnce = true;
          return;
        }
        delete this._clickedTabBarOnce;
        this._blockDblClick = false;
      }
    }, true);

    this.addEventListener("click", (event) => {
      if (event.button != 1)
        return;

      if (event.target.localName == "tab") {
        this.tabbrowser.removeTab(event.target, {
          animate: true,
          byMouse: event.mozInputSource == MouseEvent.MOZ_SOURCE_MOUSE
        });
      } else if (event.originalTarget.localName == "box") {
        // The user middleclicked an open space on the tabstrip. This could
        // be because they intend to open a new tab, but it could also be
        // because they just removed a tab and they now middleclicked on the
        // resulting space while that tab is closing. In that case, we don't
        // want to open a tab. So if we're removing one or more tabs, and
        // the tab click is before the end of the last visible tab, we do
        // nothing.
        if (this.tabbrowser._removingTabs.length) {
          let visibleTabs = this.tabbrowser.visibleTabs;
          let ltr = (window.getComputedStyle(this).direction == "ltr");
          let lastTab = visibleTabs[visibleTabs.length - 1];
          let endOfTab = lastTab.getBoundingClientRect()[ltr ? "right" : "left"];
          if ((ltr && event.clientX > endOfTab) ||
            (!ltr && event.clientX < endOfTab)) {
            BrowserOpenTab();
          }
        } else {
          BrowserOpenTab();
        }
      } else {
        return;
      }

      event.stopPropagation();
    });

    this.addEventListener("keydown", (event) => {
      if (event.altKey || event.shiftKey)
        return;

      let wrongModifiers;
      if (AppConstants.platform == "macosx") {
        wrongModifiers = !event.metaKey;
      } else {
        wrongModifiers = !event.ctrlKey || event.metaKey;
      }

      if (wrongModifiers)
        return;

      // Don't check if the event was already consumed because tab navigation
      // should work always for better user experience.

      switch (event.keyCode) {
        case KeyEvent.DOM_VK_UP:
          this.tabbrowser.moveTabBackward();
          break;
        case KeyEvent.DOM_VK_DOWN:
          this.tabbrowser.moveTabForward();
          break;
        case KeyEvent.DOM_VK_RIGHT:
        case KeyEvent.DOM_VK_LEFT:
          this.tabbrowser.moveTabOver(event);
          break;
        case KeyEvent.DOM_VK_HOME:
          this.tabbrowser.moveTabToStart();
          break;
        case KeyEvent.DOM_VK_END:
          this.tabbrowser.moveTabToEnd();
          break;
        default:
          // Consume the keydown event for the above keyboard
          // shortcuts only.
          return;
      }
      event.preventDefault();
    });

    this.addEventListener("dragstart", (event) => {
      var tab = this._getDragTargetTab(event, false);
      if (!tab || this._isCustomizing)
        return;

      let dt = event.dataTransfer;
      dt.mozSetDataAt(TAB_DROP_TYPE, tab, 0);
      let browser = tab.linkedBrowser;

      // We must not set text/x-moz-url or text/plain data here,
      // otherwise trying to deatch the tab by dropping it on the desktop
      // may result in an "internet shortcut"
      dt.mozSetDataAt("text/x-moz-text-internal", browser.currentURI.spec, 0);

      // Set the cursor to an arrow during tab drags.
      dt.mozCursor = "default";

      // Set the tab as the source of the drag, which ensures we have a stable
      // node to deliver the `dragend` event.  See bug 1345473.
      dt.addElement(tab);

      // Create a canvas to which we capture the current tab.
      // Until canvas is HiDPI-aware (bug 780362), we need to scale the desired
      // canvas size (in CSS pixels) to the window's backing resolution in order
      // to get a full-resolution drag image for use on HiDPI displays.
      let windowUtils = window.getInterface(Ci.nsIDOMWindowUtils);
      let scale = windowUtils.screenPixelsPerCSSPixel / windowUtils.fullZoom;
      let canvas = this._dndCanvas;
      if (!canvas) {
        this._dndCanvas = canvas =
          document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.mozOpaque = true;
      }

      canvas.width = 160 * scale;
      canvas.height = 90 * scale;
      let toDrag = canvas;
      let dragImageOffset = -16;
      if (gMultiProcessBrowser) {
        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let captureListener;
        let platform = AppConstants.platform;
        // On Windows and Mac we can update the drag image during a drag
        // using updateDragImage. On Linux, we can use a panel.
        if (platform == "win" || platform == "macosx") {
          captureListener = function() {
            dt.updateDragImage(canvas, dragImageOffset, dragImageOffset);
          };
        } else {
          // Create a panel to use it in setDragImage
          // which will tell xul to render a panel that follows
          // the pointer while a dnd session is on.
          if (!this._dndPanel) {
            this._dndCanvas = canvas;
            this._dndPanel = document.createElement("panel");
            this._dndPanel.className = "dragfeedback-tab";
            this._dndPanel.setAttribute("type", "drag");
            let wrapper = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            wrapper.style.width = "160px";
            wrapper.style.height = "90px";
            wrapper.appendChild(canvas);
            this._dndPanel.appendChild(wrapper);
            document.documentElement.appendChild(this._dndPanel);
          }
          toDrag = this._dndPanel;
        }
        // PageThumb is async with e10s but that's fine
        // since we can update the image during the dnd.
        PageThumbs.captureToCanvas(browser, canvas, captureListener);
      } else {
        // For the non e10s case we can just use PageThumbs
        // sync, so let's use the canvas for setDragImage.
        PageThumbs.captureToCanvas(browser, canvas);
        dragImageOffset = dragImageOffset * scale;
      }
      dt.setDragImage(toDrag, dragImageOffset, dragImageOffset);

      // _dragData.offsetX/Y give the coordinates that the mouse should be
      // positioned relative to the corner of the new window created upon
      // dragend such that the mouse appears to have the same position
      // relative to the corner of the dragged tab.
      function clientX(ele) {
        return ele.getBoundingClientRect().left;
      }
      let tabOffsetX = clientX(tab) - clientX(this);
      tab._dragData = {
        offsetX: event.screenX - window.screenX - tabOffsetX,
        offsetY: event.screenY - window.screenY,
        scrollX: this.arrowScrollbox._scrollbox.scrollLeft,
        screenX: event.screenX
      };

      event.stopPropagation();
    });

    this.addEventListener("dragover", (event) => {
      var effects = this._getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.collapsed = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;
      var ltr = (window.getComputedStyle(this).direction == "ltr");

      // autoscroll the tab strip if we drag over the scroll
      // buttons, even if we aren't dragging a tab, but then
      // return to avoid drawing the drop indicator
      var pixelsToScroll = 0;
      if (this.getAttribute("overflow") == "true") {
        var targetAnonid = event.originalTarget.getAttribute("anonid");
        switch (targetAnonid) {
          case "scrollbutton-up":
            pixelsToScroll = arrowScrollbox.scrollIncrement * -1;
            break;
          case "scrollbutton-down":
            pixelsToScroll = arrowScrollbox.scrollIncrement;
            break;
        }
        if (pixelsToScroll)
          arrowScrollbox.scrollByPixels((ltr ? 1 : -1) * pixelsToScroll, true);
      }

      if (effects == "move" &&
        this == event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0).parentNode) {
        ind.collapsed = true;
        this._animateTabMove(event);
        return;
      }

      this._finishAnimateTabMove();

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, true);
        if (tab) {
          if (!this._dragTime)
            this._dragTime = Date.now();
          if (Date.now() >= this._dragTime + this._dragOverDelay)
            this.selectedItem = tab;
          ind.collapsed = true;
          return;
        }
      }

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMargin;
      if (pixelsToScroll) {
        // if we are scrolling, put the drop indicator at the edge
        // so that it doesn't jump while scrolling
        let scrollRect = arrowScrollbox.scrollClientRect;
        let minMargin = scrollRect.left - rect.left;
        let maxMargin = Math.min(minMargin + scrollRect.width,
          scrollRect.right);
        if (!ltr)
          [minMargin, maxMargin] = [this.clientWidth - maxMargin,
            this.clientWidth - minMargin
          ];
        newMargin = (pixelsToScroll > 0) ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event, effects == "link");
        if (newIndex == this.childNodes.length) {
          let tabRect = this.childNodes[newIndex - 1].getBoundingClientRect();
          if (ltr)
            newMargin = tabRect.right - rect.left;
          else
            newMargin = rect.right - tabRect.left;
        } else {
          let tabRect = this.childNodes[newIndex].getBoundingClientRect();
          if (ltr)
            newMargin = tabRect.left - rect.left;
          else
            newMargin = rect.right - tabRect.right;
        }
      }

      ind.collapsed = false;

      newMargin += ind.clientWidth / 2;
      if (!ltr)
        newMargin *= -1;

      ind.style.transform = "translate(" + Math.round(newMargin) + "px)";
      ind.style.marginInlineStart = (-ind.clientWidth) + "px";
    });

    this.addEventListener("drop", (event) => {
      var dt = event.dataTransfer;
      var dropEffect = dt.dropEffect;
      var draggedTab;
      if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) { // tab copy or move
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        // not our drop then
        if (!draggedTab)
          return;
      }

      this._tabDropIndicator.collapsed = true;
      event.stopPropagation();
      if (draggedTab && dropEffect == "copy") {
        // copy the dropped tab (wherever it's from)
        let newIndex = this._getDropIndex(event, false);
        let newTab = this.tabbrowser.duplicateTab(draggedTab);
        this.tabbrowser.moveTabTo(newTab, newIndex);
        if (draggedTab.parentNode != this || event.shiftKey)
          this.selectedItem = newTab;
      } else if (draggedTab && draggedTab.parentNode == this) {
        let oldTranslateX = Math.round(draggedTab._dragData.translateX);
        let tabWidth = Math.round(draggedTab._dragData.tabWidth);
        let translateOffset = oldTranslateX % tabWidth;
        let newTranslateX = oldTranslateX - translateOffset;
        if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
          newTranslateX += tabWidth;
        } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
          newTranslateX -= tabWidth;
        }

        let dropIndex = "animDropIndex" in draggedTab._dragData &&
          draggedTab._dragData.animDropIndex;
        if (dropIndex && dropIndex > draggedTab._tPos)
          dropIndex--;

        let animate = this.tabbrowser.animationsEnabled;
        if (oldTranslateX && oldTranslateX != newTranslateX && animate) {
          draggedTab.setAttribute("tabdrop-samewindow", "true");
          draggedTab.style.transform = "translateX(" + newTranslateX + "px)";
          let onTransitionEnd = transitionendEvent => {
            if (transitionendEvent.propertyName != "transform" ||
              transitionendEvent.originalTarget != draggedTab) {
              return;
            }
            draggedTab.removeEventListener("transitionend", onTransitionEnd);

            draggedTab.removeAttribute("tabdrop-samewindow");

            this._finishAnimateTabMove();
            if (dropIndex !== false)
              this.tabbrowser.moveTabTo(draggedTab, dropIndex);

            this.tabbrowser.syncThrobberAnimations(draggedTab);
          };
          draggedTab.addEventListener("transitionend", onTransitionEnd);
        } else {
          this._finishAnimateTabMove();
          if (dropIndex !== false)
            this.tabbrowser.moveTabTo(draggedTab, dropIndex);
        }
      } else if (draggedTab) {
        let newIndex = this._getDropIndex(event, false);
        this.tabbrowser.adoptTab(draggedTab, newIndex, true);
      } else {
        // Pass true to disallow dropping javascript: or data: urls
        let links;
        try {
          links = browserDragAndDrop.dropLinks(event, true);
        } catch (ex) {}

        if (!links || links.length === 0)
          return;

        let inBackground = Services.prefs.getBoolPref("browser.tabs.loadInBackground");

        if (event.shiftKey)
          inBackground = !inBackground;

        let targetTab = this._getDragTargetTab(event, true);
        let userContextId = this.selectedItem.getAttribute("usercontextid");
        let replace = !!targetTab;
        let newIndex = this._getDropIndex(event, true);
        let urls = links.map(link => link.url);

        let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(event);
        this.tabbrowser.loadTabs(urls, {
          inBackground,
          replace,
          allowThirdPartyFixup: true,
          targetTab,
          newIndex,
          userContextId,
          triggeringPrincipal,
        });
      }

      if (draggedTab) {
        delete draggedTab._dragData;
      }
    });

    this.addEventListener("dragend", (event) => {
      var dt = event.dataTransfer;
      var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);

      // Prevent this code from running if a tabdrop animation is
      // running since calling _finishAnimateTabMove would clear
      // any CSS transition that is running.
      if (draggedTab.hasAttribute("tabdrop-samewindow"))
        return;

      this._finishAnimateTabMove();

      if (dt.mozUserCancelled || dt.dropEffect != "none" || this._isCustomizing) {
        delete draggedTab._dragData;
        return;
      }

      // Disable detach within the browser toolbox
      var eX = event.screenX;
      var eY = event.screenY;
      var wX = window.screenX;
      // check if the drop point is horizontally within the window
      if (eX > wX && eX < (wX + window.outerWidth)) {
        let bo = this.arrowScrollbox.boxObject;
        // also avoid detaching if the the tab was dropped too close to
        // the tabbar (half a tab)
        let endScreenY = bo.screenY + 1.5 * bo.height;
        if (eY < endScreenY && eY > window.screenY)
          return;
      }

      // screen.availLeft et. al. only check the screen that this window is on,
      // but we want to look at the screen the tab is being dropped onto.
      var screen = Cc["@mozilla.org/gfx/screenmanager;1"]
        .getService(Ci.nsIScreenManager)
        .screenForRect(eX, eY, 1, 1);
      var fullX = {},
        fullY = {},
        fullWidth = {},
        fullHeight = {};
      var availX = {},
        availY = {},
        availWidth = {},
        availHeight = {};
      // get full screen rect and available rect, both in desktop pix
      screen.GetRectDisplayPix(fullX, fullY, fullWidth, fullHeight);
      screen.GetAvailRectDisplayPix(availX, availY, availWidth, availHeight);

      // scale factor to convert desktop pixels to CSS px
      var scaleFactor =
        screen.contentsScaleFactor / screen.defaultCSSScaleFactor;
      // synchronize CSS-px top-left coordinates with the screen's desktop-px
      // coordinates, to ensure uniqueness across multiple screens
      // (compare the equivalent adjustments in nsGlobalWindow::GetScreenXY()
      // and related methods)
      availX.value = (availX.value - fullX.value) * scaleFactor + fullX.value;
      availY.value = (availY.value - fullY.value) * scaleFactor + fullY.value;
      availWidth.value *= scaleFactor;
      availHeight.value *= scaleFactor;

      // ensure new window entirely within screen
      var winWidth = Math.min(window.outerWidth, availWidth.value);
      var winHeight = Math.min(window.outerHeight, availHeight.value);
      var left = Math.min(Math.max(eX - draggedTab._dragData.offsetX, availX.value),
        availX.value + availWidth.value - winWidth);
      var top = Math.min(Math.max(eY - draggedTab._dragData.offsetY, availY.value),
        availY.value + availHeight.value - winHeight);

      delete draggedTab._dragData;

      if (this.tabbrowser.tabs.length == 1) {
        // resize _before_ move to ensure the window fits the new screen.  if
        // the window is too large for its screen, the window manager may do
        // automatic repositioning.
        window.resizeTo(winWidth, winHeight);
        window.moveTo(left, top);
        window.focus();
      } else {
        let props = {
          screenX: left,
          screenY: top,
          suppressanimation: 1
        };
        if (AppConstants.platform != "win") {
          props.outerWidth = winWidth;
          props.outerHeight = winHeight;
        }
        this.tabbrowser.replaceTabWithWindow(draggedTab, props);
      }
      event.stopPropagation();
    });

    this.addEventListener("dragexit", (event) => {
      this._dragTime = 0;

      // This does not work at all (see bug 458613)
      var target = event.relatedTarget;
      while (target && target != this)
        target = target.parentNode;
      if (target)
        return;

      this._tabDropIndicator.collapsed = true;
      event.stopPropagation();
    });

  }
}