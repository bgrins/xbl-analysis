class FirefoxTabbrowserTabs extends FirefoxTabs {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox align="end">
<image class="tab-drop-indicator" anonid="tab-drop-indicator" collapsed="true">
</image>
</hbox>
<arrowscrollbox anonid="arrowscrollbox" orient="horizontal" flex="1" style="min-width: 1px;" class="tabbrowser-arrowscrollbox">
<children includes="tab">
</children>
<children>
</children>
<toolbarbutton class="tabs-newtab-button toolbarbutton-1" anonid="tabs-newtab-button" command="cmd_newNavigatorTab" onclick="checkForMiddleClick(this, event);" tooltip="dynamic-shortcut-tooltip">
</toolbarbutton>
<hbox class="restore-tabs-button-wrapper" anonid="restore-tabs-button-wrapper">
<toolbarbutton anonid="restore-tabs-button" class="restore-tabs-button" onclick="SessionStore.restoreLastSession();">
</toolbarbutton>
</hbox>
<spacer class="closing-tabs-spacer" anonid="closing-tabs-spacer" style="width: 0;">
</spacer>
</arrowscrollbox>`;
    let comment = document.createComment("Creating firefox-tabbrowser-tabs");
    this.prepend(comment);

    Object.defineProperty(this, "tabbrowser", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.tabbrowser;
        return (this.tabbrowser = document.getElementById(
          this.getAttribute("tabbrowser")
        ));
      },
      set(val) {
        delete this["tabbrowser"];
        return (this["tabbrowser"] = val);
      }
    });
    Object.defineProperty(this, "tabbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.tabbox;
        return (this.tabbox = this.tabbrowser.mTabBox);
      },
      set(val) {
        delete this["tabbox"];
        return (this["tabbox"] = val);
      }
    });
    Object.defineProperty(this, "contextMenu", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.contextMenu;
        return (this.contextMenu = document.getElementById("tabContextMenu"));
      },
      set(val) {
        delete this["contextMenu"];
        return (this["contextMenu"] = val);
      }
    });
    Object.defineProperty(this, "mTabstripWidth", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mTabstripWidth;
        return (this.mTabstripWidth = 0);
      },
      set(val) {
        delete this["mTabstripWidth"];
        return (this["mTabstripWidth"] = val);
      }
    });
    Object.defineProperty(this, "mTabstrip", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mTabstrip;
        return (this.mTabstrip = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "arrowscrollbox"
        ));
      },
      set(val) {
        delete this["mTabstrip"];
        return (this["mTabstrip"] = val);
      }
    });
    Object.defineProperty(this, "_firstTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._firstTab;
        return (this._firstTab = null);
      },
      set(val) {
        delete this["_firstTab"];
        return (this["_firstTab"] = val);
      }
    });
    Object.defineProperty(this, "_lastTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastTab;
        return (this._lastTab = null);
      },
      set(val) {
        delete this["_lastTab"];
        return (this["_lastTab"] = val);
      }
    });
    Object.defineProperty(this, "_afterSelectedTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._afterSelectedTab;
        return (this._afterSelectedTab = null);
      },
      set(val) {
        delete this["_afterSelectedTab"];
        return (this["_afterSelectedTab"] = val);
      }
    });
    Object.defineProperty(this, "_beforeHoveredTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._beforeHoveredTab;
        return (this._beforeHoveredTab = null);
      },
      set(val) {
        delete this["_beforeHoveredTab"];
        return (this["_beforeHoveredTab"] = val);
      }
    });
    Object.defineProperty(this, "_afterHoveredTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._afterHoveredTab;
        return (this._afterHoveredTab = null);
      },
      set(val) {
        delete this["_afterHoveredTab"];
        return (this["_afterHoveredTab"] = val);
      }
    });
    Object.defineProperty(this, "_hoveredTab", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._hoveredTab;
        return (this._hoveredTab = null);
      },
      set(val) {
        delete this["_hoveredTab"];
        return (this["_hoveredTab"] = val);
      }
    });
    Object.defineProperty(this, "restoreTabsButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.restoreTabsButton;
        return (this.restoreTabsButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "restore-tabs-button"
        ));
      },
      set(val) {
        delete this["restoreTabsButton"];
        return (this["restoreTabsButton"] = val);
      }
    });
    Object.defineProperty(this, "_restoreTabsButtonWrapperWidth", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._restoreTabsButtonWrapperWidth;
        return (this._restoreTabsButtonWrapperWidth = 0);
      },
      set(val) {
        delete this["_restoreTabsButtonWrapperWidth"];
        return (this["_restoreTabsButtonWrapperWidth"] = val);
      }
    });
    Object.defineProperty(this, "windowUtils", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.windowUtils;
        return (this.windowUtils = window
          .QueryInterface(Ci.nsIInterfaceRequestor)
          .getInterface(Ci.nsIDOMWindowUtils));
      },
      set(val) {
        delete this["windowUtils"];
        return (this["windowUtils"] = val);
      }
    });
    Object.defineProperty(this, "_blockDblClick", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._blockDblClick;
        return (this._blockDblClick = false);
      },
      set(val) {
        delete this["_blockDblClick"];
        return (this["_blockDblClick"] = val);
      }
    });
    Object.defineProperty(this, "_tabDropIndicator", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._tabDropIndicator;
        return (this._tabDropIndicator = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "tab-drop-indicator"
        ));
      },
      set(val) {
        delete this["_tabDropIndicator"];
        return (this["_tabDropIndicator"] = val);
      }
    });
    Object.defineProperty(this, "_dragOverDelay", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragOverDelay;
        return (this._dragOverDelay = 350);
      },
      set(val) {
        delete this["_dragOverDelay"];
        return (this["_dragOverDelay"] = val);
      }
    });
    Object.defineProperty(this, "_dragTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dragTime;
        return (this._dragTime = 0);
      },
      set(val) {
        delete this["_dragTime"];
        return (this["_dragTime"] = val);
      }
    });
    Object.defineProperty(this, "_container", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._container;
        return (this._container = this.parentNode &&
          this.parentNode.localName == "toolbar"
          ? this.parentNode
          : this);
      },
      set(val) {
        delete this["_container"];
        return (this["_container"] = val);
      }
    });
    Object.defineProperty(this, "_propagatedVisibilityOnce", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._propagatedVisibilityOnce;
        return (this._propagatedVisibilityOnce = false);
      },
      set(val) {
        delete this["_propagatedVisibilityOnce"];
        return (this["_propagatedVisibilityOnce"] = val);
      }
    });
    Object.defineProperty(this, "_closeButtonsUpdatePending", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._closeButtonsUpdatePending;
        return (this._closeButtonsUpdatePending = false);
      },
      set(val) {
        delete this["_closeButtonsUpdatePending"];
        return (this["_closeButtonsUpdatePending"] = val);
      }
    });
    Object.defineProperty(this, "_closingTabsSpacer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._closingTabsSpacer;
        return (this._closingTabsSpacer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "closing-tabs-spacer"
        ));
      },
      set(val) {
        delete this["_closingTabsSpacer"];
        return (this["_closingTabsSpacer"] = val);
      }
    });
    Object.defineProperty(this, "_tabDefaultMaxWidth", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._tabDefaultMaxWidth;
        return (this._tabDefaultMaxWidth = NaN);
      },
      set(val) {
        delete this["_tabDefaultMaxWidth"];
        return (this["_tabDefaultMaxWidth"] = val);
      }
    });
    Object.defineProperty(this, "_lastTabClosedByMouse", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastTabClosedByMouse;
        return (this._lastTabClosedByMouse = false);
      },
      set(val) {
        delete this["_lastTabClosedByMouse"];
        return (this["_lastTabClosedByMouse"] = val);
      }
    });
    Object.defineProperty(this, "_hasTabTempMaxWidth", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._hasTabTempMaxWidth;
        return (this._hasTabTempMaxWidth = false);
      },
      set(val) {
        delete this["_hasTabTempMaxWidth"];
        return (this["_hasTabTempMaxWidth"] = val);
      }
    });
    Object.defineProperty(this, "_lastNumPinned", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastNumPinned;
        return (this._lastNumPinned = 0);
      },
      set(val) {
        delete this["_lastNumPinned"];
        return (this["_lastNumPinned"] = val);
      }
    });
    Object.defineProperty(this, "_pinnedTabsLayoutCache", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._pinnedTabsLayoutCache;
        return (this._pinnedTabsLayoutCache = null);
      },
      set(val) {
        delete this["_pinnedTabsLayoutCache"];
        return (this["_pinnedTabsLayoutCache"] = val);
      }
    });
    Object.defineProperty(this, "_animateElement", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._animateElement;
        return (this._animateElement = this.mTabstrip._scrollButtonDown);
      },
      set(val) {
        delete this["_animateElement"];
        return (this["_animateElement"] = val);
      }
    });

    try {
      this.mTabClipWidth = Services.prefs.getIntPref(
        "browser.tabs.tabClipWidth"
      );

      let { restoreTabsButton } = this;
      restoreTabsButton.setAttribute(
        "label",
        this.tabbrowser.mStringBundle.getString("tabs.restoreLastTabs")
      );

      var tab = this.firstChild;
      tab.label = this.tabbrowser.mStringBundle.getString("tabs.emptyTabTitle");
      tab.setAttribute("onerror", "this.removeAttribute('image');");

      window.addEventListener("resize", this);
      window.addEventListener("load", this);

      Services.prefs.addObserver("privacy.userContext", this);
      this.observe(null, "nsPref:changed", "privacy.userContext.enabled");

      this._setPositionalAttributes();
    } catch (e) {}
  }
  disconnectedCallback() {}

  get restoreTabsButtonWrapperWidth() {
    undefined;
  }

  get _isCustomizing() {
    return document.documentElement.getAttribute("customizing") == "true";
  }

  set visible(val) {
    if (val == this.visible && this._propagatedVisibilityOnce) return val;

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
      windowUtils,
      mTabstripWidth
    } = this;
    let restoreTabsButtonWrapper = restoreTabsButton.parentNode;

    if (!restoreTabsButtonWrapper.getAttribute("session-exists")) {
      restoreTabsButtonWrapper.removeAttribute("shown");
      return;
    }

    let newTabButton = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "tabs-newtab-button"
    );

    // If there are no pinned tabs it will multiply by 0 and result in 0
    let pinnedTabsWidth =
      windowUtils.getBoundsWithoutFlushing(this.firstChild).width *
      this._lastNumPinned;

    let numUnpinnedTabs = this.childNodes.length - this._lastNumPinned;
    let unpinnedTabsWidth =
      windowUtils.getBoundsWithoutFlushing(this.lastChild).width *
      numUnpinnedTabs;

    let tabbarUsedSpace =
      pinnedTabsWidth +
      unpinnedTabsWidth +
      windowUtils.getBoundsWithoutFlushing(newTabButton).width;

    // Subtract the elements' widths from the available space to ensure
    // that showing the restoreTabsButton won't cause any overflow.
    if (mTabstripWidth - tabbarUsedSpace > restoreTabsButtonWrapperWidth) {
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
        let containersEnabled =
          Services.prefs.getBoolPref("privacy.userContext.enabled") &&
          !PrivateBrowsingUtils.isWindowPrivate(window);

        // This pref won't change so often, so just recreate the menu.
        let longPressBehavior = Services.prefs.getIntPref(
          "privacy.userContext.longPressBehavior"
        );

        // If longPressBehavior pref is set to 0 (or any invalid value)
        // long press menu is disabled.
        if (
          containersEnabled &&
          (longPressBehavior <= 0 || longPressBehavior > 2)
        ) {
          containersEnabled = false;
        }

        const newTab = document.getElementById("new-tab-button");
        const newTab2 = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "tabs-newtab-button"
        );

        for (let parent of [newTab, newTab2]) {
          if (!parent) continue;

          gClickAndHoldListenersOnElement.remove(parent);
          parent.removeAttribute("type");
          if (parent.firstChild) {
            parent.firstChild.remove();
          }

          if (containersEnabled) {
            let popup = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menupopup"
            );
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

    if (!visibleTabs.length) return;

    let selectedIndex = visibleTabs.indexOf(this.selectedItem);

    let lastVisible = visibleTabs.length - 1;

    if (this._afterSelectedTab)
      this._afterSelectedTab.removeAttribute("afterselected-visible");
    if (this.selectedItem.closing || selectedIndex == lastVisible) {
      this._afterSelectedTab = null;
    } else {
      this._afterSelectedTab = visibleTabs[selectedIndex + 1];
      this._afterSelectedTab.setAttribute("afterselected-visible", "true");
    }

    if (this._firstTab) this._firstTab.removeAttribute("first-visible-tab");
    this._firstTab = visibleTabs[0];
    this._firstTab.setAttribute("first-visible-tab", "true");
    if (this._lastTab) this._lastTab.removeAttribute("last-visible-tab");
    this._lastTab = visibleTabs[lastVisible];
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
    document
      .getElementById("menu_close")
      .setAttribute(
        "label",
        this.tabbrowser.mStringBundle.getString(
          visible ? "tabs.closeTab" : "tabs.close"
        )
      );

    TabsInTitlebar.allowedBy("tabs-visible", visible);
  }
  updateVisibility() {
    if (this.childNodes.length - this.tabbrowser._removingTabs.length == 1)
      this.visible = window.toolbar.visible;
    else this.visible = true;
  }
  adjustTabstrip() {
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
          return window
            .QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindowUtils)
            .getBoundsWithoutFlushing(ele);
        };
        let tab = this.tabbrowser.visibleTabs[this.tabbrowser._numPinnedTabs];
        if (tab && rect(tab).width <= this.mTabClipWidth) {
          this.setAttribute("closebuttons", "activetab");
        } else {
          this.removeAttribute("closebuttons");
        }
      });
    });
  }
  _handleTabSelect(aInstant) {
    if (this.getAttribute("overflow") == "true")
      this.mTabstrip.ensureElementIsVisible(this.selectedItem, aInstant);
  }
  _lockTabSizing(aTab) {
    var tabs = this.tabbrowser.visibleTabs;
    if (!tabs.length) return;

    var isEndTab = aTab._tPos > tabs[tabs.length - 1]._tPos;
    var tabWidth = aTab.getBoundingClientRect().width;

    if (!this._tabDefaultMaxWidth)
      this._tabDefaultMaxWidth = parseFloat(
        window.getComputedStyle(aTab).maxWidth
      );
    this._lastTabClosedByMouse = true;

    if (this.getAttribute("overflow") == "true") {
      // Don't need to do anything if we're in overflow mode and aren't scrolled
      // all the way to the right, or if we're closing the last tab.
      if (isEndTab || !this.mTabstrip._scrollButtonDown.disabled) return;

      // If the tab has an owner that will become the active tab, the owner will
      // be to the left of it, so we actually want the left tab to slide over.
      // This can't be done as easily in non-overflow mode, so we don't bother.
      if (aTab.owner) return;

      this._expandSpacerBy(tabWidth);
    } else {
      // non-overflow mode
      // Locking is neither in effect nor needed, so let tabs expand normally.
      if (isEndTab && !this._hasTabTempMaxWidth) return;

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
        if (!isEndTab) {
          // keep tabs the same width
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
      for (let i = 0; i < tabs.length; i++) tabs[i].style.maxWidth = "";
    }

    if (this.hasAttribute("using-closing-tabs-spacer")) {
      this.removeAttribute("using-closing-tabs-spacer");
      this._closingTabsSpacer.style.width = 0;
    }
  }
  _positionPinnedTabs() {
    var numPinned = this.tabbrowser._numPinnedTabs;
    var doPosition = this.getAttribute("overflow") == "true" && numPinned > 0;

    if (doPosition) {
      this.setAttribute("positionpinnedtabs", "true");

      let layoutData = this._pinnedTabsLayoutCache;
      if (!layoutData) {
        let tabstrip = this.mTabstrip;
        layoutData = this._pinnedTabsLayoutCache = {
          pinnedTabWidth: this.childNodes[0].getBoundingClientRect().width,
          scrollButtonWidth: tabstrip._scrollButtonDown.getBoundingClientRect()
            .width
        };
      }

      let width = 0;
      for (let i = numPinned - 1; i >= 0; i--) {
        let tab = this.childNodes[i];
        width += layoutData.pinnedTabWidth;
        tab.style.marginInlineStart =
          -(width + layoutData.scrollButtonWidth) + "px";
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
      this.selectedItem = draggedTab;
    }

    if (!("animLastScreenX" in draggedTab._dragData))
      draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;

    let screenX = event.screenX;
    if (screenX == draggedTab._dragData.animLastScreenX) return;

    draggedTab._dragData.animLastScreenX = screenX;

    let rtl = window.getComputedStyle(this).direction == "rtl";
    let pinned = draggedTab.pinned;
    let numPinned = this.tabbrowser._numPinnedTabs;
    let tabs = this.tabbrowser.visibleTabs.slice(
      pinned ? 0 : numPinned,
      pinned ? numPinned : undefined
    );
    if (rtl) tabs.reverse();
    let tabWidth = draggedTab.getBoundingClientRect().width;
    draggedTab._dragData.tabWidth = tabWidth;

    // Move the dragged tab based on the mouse position.

    let leftTab = tabs[0];
    let rightTab = tabs[tabs.length - 1];
    let tabScreenX = draggedTab.boxObject.screenX;
    let translateX = screenX - draggedTab._dragData.screenX;
    if (!pinned)
      translateX +=
        this.mTabstrip._scrollbox.scrollLeft - draggedTab._dragData.scrollX;
    let leftBound = leftTab.boxObject.screenX - tabScreenX;
    let rightBound =
      rightTab.boxObject.screenX +
      rightTab.boxObject.width -
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
    let oldIndex = "animDropIndex" in draggedTab._dragData
      ? draggedTab._dragData.animDropIndex
      : draggedTab._tPos;
    let low = 0;
    let high = tabs.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (tabs[mid] == draggedTab && ++mid > high) break;
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
    if (newIndex >= oldIndex) newIndex++;
    if (newIndex < 0 || newIndex == oldIndex) return;
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
    if (this.getAttribute("movingtab") != "true") return;

    for (let tab of this.tabbrowser.visibleTabs) tab.style.transform = "";

    this.removeAttribute("movingtab");

    this._handleTabSelect();
  }
  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "load":
        this.updateVisibility();
        TabsInTitlebar.init();
        break;
      case "resize":
        if (aEvent.target != window) break;

        TabsInTitlebar.updateAppearance();

        var width = this.mTabstrip.boxObject.width;
        if (width != this.mTabstripWidth) {
          this.adjustTabstrip();
          this._handleTabSelect(true);
          this.mTabstripWidth = width;
          this.updateSessionRestoreVisibility();
        }
        break;
      case "mouseout":
        // If the "related target" (the node to which the pointer went) is not
        // a child of the current document, the mouse just left the window.
        let relatedTarget = aEvent.relatedTarget;
        if (relatedTarget && relatedTarget.ownerDocument == document) break;
      case "mousemove":
        if (document.getElementById("tabContextMenu").state != "open")
          this._unlockTabSizing();
        break;
    }
  }
  _notifyBackgroundTab(aTab) {
    if (aTab.pinned || aTab.hidden) return;

    var scrollRect = this.mTabstrip.scrollClientRect;
    var tab = aTab.getBoundingClientRect();

    // DOMRect left/right properties are immutable.
    tab = { left: tab.left, right: tab.right };

    // Is the new tab already completely visible?
    if (scrollRect.left <= tab.left && tab.right <= scrollRect.right) return;

    if (this.mTabstrip.smoothScroll) {
      let selected =
        !this.selectedItem.pinned && this.selectedItem.getBoundingClientRect();

      // Can we make both the new tab and the selected tab completely visible?
      if (
        !selected ||
        Math.max(tab.right - selected.left, selected.right - tab.left) <=
          scrollRect.width
      ) {
        this.mTabstrip.ensureElementIsVisible(aTab);
        return;
      }

      this.mTabstrip.scrollByPixels(
        this.mTabstrip._isRTLScrollbox
          ? selected.right - scrollRect.right
          : selected.left - scrollRect.left
      );
    }

    if (!this._animateElement.hasAttribute("highlight")) {
      this._animateElement.setAttribute("highlight", "true");
      setTimeout(
        function(ele) {
          ele.removeAttribute("highlight");
        },
        150,
        this._animateElement
      );
    }
  }
  _getDragTargetTab(event, isLink) {
    let tab = event.target.localName == "tab" ? event.target : null;
    if (tab && isLink) {
      let boxObject = tab.boxObject;
      if (
        event.screenX < boxObject.screenX + boxObject.width * 0.25 ||
        event.screenX > boxObject.screenX + boxObject.width * 0.75
      )
        return null;
    }
    return tab;
  }
  _getDropIndex(event, isLink) {
    var tabs = this.childNodes;
    var tab = this._getDragTargetTab(event, isLink);
    if (window.getComputedStyle(this).direction == "ltr") {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (
          event.screenX <
          tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
        )
          return i;
    } else {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (
          event.screenX >
          tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
        )
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
        if (
          sourceNode instanceof XULElement &&
          sourceNode.localName == "tab" &&
          sourceNode.ownerGlobal instanceof ChromeWindow &&
          sourceNode.ownerDocument.documentElement.getAttribute("windowtype") ==
            "navigator:browser" &&
          sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.parentNode
        ) {
          // Do not allow transfering a private tab to a non-private window
          // and vice versa.
          if (
            PrivateBrowsingUtils.isWindowPrivate(window) !=
            PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal)
          )
            return "none";

          if (
            window.gMultiProcessBrowser !=
            sourceNode.ownerGlobal.gMultiProcessBrowser
          )
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
    if (tab.parentNode != this) return;
    tab._fullyOpen = true;
    this.tabbrowser.tabAnimationsInProgress--;

    this.adjustTabstrip();

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
    this.mTabstrip._updateScrollButtonsDisabledState();

    // Preload the next about:newtab if there isn't one already.
    this.tabbrowser._createPreloadBrowser();
  }
  _canAdvanceToTab(aTab) {
    return !aTab.closing;
  }
  getRelatedElement(aTab) {
    if (!aTab) return null;
    // If the tab's browser is lazy, we need to `_insertBrowser` in order
    // to have a linkedPanel.  This will also serve to bind the browser
    // and make it ready to use when the tab is selected.
    this.tabbrowser._insertBrowser(aTab);
    return document.getElementById(aTab.linkedPanel);
  }
}
customElements.define("firefox-tabbrowser-tabs", FirefoxTabbrowserTabs);
