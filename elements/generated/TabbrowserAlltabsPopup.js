class FirefoxTabbrowserAlltabsPopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  _tabOnAttrModified(aEvent) {
    var tab = aEvent.target;
    if (tab.mCorrespondingMenuitem)
      this._setMenuitemAttributes(tab.mCorrespondingMenuitem, tab);
  }

  _tabOnTabClose(aEvent) {
    var tab = aEvent.target;
    if (tab.mCorrespondingMenuitem)
      this.removeChild(tab.mCorrespondingMenuitem);
  }

  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "TabAttrModified":
        this._tabOnAttrModified(aEvent);
        break;
      case "TabClose":
        this._tabOnTabClose(aEvent);
        break;
    }
  }

  _updateTabsVisibilityStatus() {
    var tabContainer = gBrowser.tabContainer;
    // We don't want menu item decoration unless there is overflow.
    if (tabContainer.getAttribute("overflow") != "true") {
      return;
    }

    let windowUtils = window.QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIDOMWindowUtils);
    let arrowScrollboxRect = windowUtils.getBoundsWithoutFlushing(tabContainer.arrowScrollbox);
    for (let menuitem of this.childNodes) {
      let curTab = menuitem.tab;
      if (!curTab) {
        // "Undo close tab", menuseparator, or entries put here by addons.
        continue;
      }
      let curTabRect = windowUtils.getBoundsWithoutFlushing(curTab);
      if (curTabRect.left >= arrowScrollboxRect.left &&
        curTabRect.right <= arrowScrollboxRect.right) {
        menuitem.setAttribute("tabIsVisible", "true");
      } else {
        menuitem.removeAttribute("tabIsVisible");
      }
    }
  }

  _createTabMenuItem(aTab) {
    var menuItem = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "menuitem");

    menuItem.setAttribute("class", "menuitem-iconic alltabs-item menuitem-with-favicon");

    this._setMenuitemAttributes(menuItem, aTab);

    aTab.mCorrespondingMenuitem = menuItem;
    menuItem.tab = aTab;

    this.appendChild(menuItem);
  }

  _setMenuitemAttributes(aMenuitem, aTab) {
    aMenuitem.setAttribute("label", aTab.label);
    aMenuitem.setAttribute("crop", "end");

    if (aTab.hasAttribute("busy")) {
      aMenuitem.setAttribute("busy", aTab.getAttribute("busy"));
      aMenuitem.removeAttribute("iconloadingprincipal");
      aMenuitem.removeAttribute("image");
    } else {
      aMenuitem.setAttribute("iconloadingprincipal", aTab.getAttribute("iconloadingprincipal"));
      aMenuitem.setAttribute("image", aTab.getAttribute("image"));
      aMenuitem.removeAttribute("busy");
    }

    if (aTab.hasAttribute("pending"))
      aMenuitem.setAttribute("pending", aTab.getAttribute("pending"));
    else
      aMenuitem.removeAttribute("pending");

    if (aTab.selected)
      aMenuitem.setAttribute("selected", "true");
    else
      aMenuitem.removeAttribute("selected");

    function addEndImage() {
      let endImage = document.createElement("image");
      endImage.setAttribute("class", "alltabs-endimage");
      let endImageContainer = document.createElement("hbox");
      endImageContainer.setAttribute("align", "center");
      endImageContainer.setAttribute("pack", "center");
      endImageContainer.appendChild(endImage);
      aMenuitem.appendChild(endImageContainer);
      return endImage;
    }

    if (aMenuitem.firstChild)
      aMenuitem.firstChild.remove();
    if (aTab.hasAttribute("muted"))
      addEndImage().setAttribute("muted", "true");
    else if (aTab.hasAttribute("soundplaying"))
      addEndImage().setAttribute("soundplaying", "true");
  }

  _setupEventListeners() {
    this.addEventListener("popupshowing", (event) => {
      if (event.target.getAttribute("id") == "alltabs_containersMenuTab") {
        createUserContextMenu(event, { useAccessKeys: false });
        return;
      }

      let containersEnabled = Services.prefs.getBoolPref("privacy.userContext.enabled");

      if (event.target.getAttribute("anonid") == "newtab-popup" ||
        event.target.id == "newtab-popup") {
        createUserContextMenu(event, {
          useAccessKeys: false,
          showDefaultTab: Services.prefs.getIntPref("privacy.userContext.longPressBehavior") == 1
        });
      } else {
        document.getElementById("alltabs-popup-separator-1").hidden = !containersEnabled;
        let containersTab = document.getElementById("alltabs_containersTab");

        containersTab.hidden = !containersEnabled;
        if (PrivateBrowsingUtils.isWindowPrivate(window)) {
          containersTab.setAttribute("disabled", "true");
        }

        document.getElementById("alltabs_undoCloseTab").disabled =
          SessionStore.getClosedTabCount(window) == 0;

        var tabcontainer = gBrowser.tabContainer;

        // Listen for changes in the tab bar.
        tabcontainer.addEventListener("TabAttrModified", this);
        tabcontainer.addEventListener("TabClose", this);

        let tabs = gBrowser.visibleTabs;
        for (var i = 0; i < tabs.length; i++) {
          if (!tabs[i].pinned)
            this._createTabMenuItem(tabs[i]);
        }
        this._updateTabsVisibilityStatus();
      }
    });

    this.addEventListener("popuphidden", (event) => {
      if (event.target.getAttribute("id") == "alltabs_containersMenuTab") {
        return;
      }

      // clear out the menu popup and remove the listeners
      for (let i = this.childNodes.length - 1; i > 0; i--) {
        let menuItem = this.childNodes[i];
        if (menuItem.tab) {
          menuItem.tab.mCorrespondingMenuitem = null;
          this.removeChild(menuItem);
        }
        if (menuItem.hasAttribute("usercontextid")) {
          this.removeChild(menuItem);
        }
      }
      var tabcontainer = gBrowser.tabContainer;
      tabcontainer.removeEventListener("TabAttrModified", this);
      tabcontainer.removeEventListener("TabClose", this);
    });

    this.addEventListener("DOMMenuItemActive", (event) => {
      var tab = event.target.tab;
      if (tab) {
        let overLink = tab.linkedBrowser.currentURI.displaySpec;
        if (overLink == "about:blank")
          overLink = "";
        XULBrowserWindow.setOverLink(overLink, null);
      }
    });

    this.addEventListener("DOMMenuItemInactive", (event) => {
      XULBrowserWindow.setOverLink("", null);
    });

    this.addEventListener("command", (event) => {
      if (event.target.tab) {
        if (gBrowser.selectedTab != event.target.tab) {
          gBrowser.selectedTab = event.target.tab;
        } else {
          gBrowser.tabContainer._handleTabSelect();
        }
      }
    });

  }
}