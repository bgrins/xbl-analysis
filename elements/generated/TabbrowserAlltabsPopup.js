class FirefoxTabbrowserAlltabsPopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
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

  _initializeTabsPopups(event) {
    if (this._tabsPopups) {
      return;
    }
    // These TabsPopup objects will handle creating menuitem elements
    // for tabs in this popup. They have their own popupshowing and
    // popuphidden listeners to manage the items.
    //
    // Since gBrowser isn't initialized yet in the constructor these are
    // created on the first popupshowing event. The initial event is
    // proxied once the popups are created.
    this._tabsPopups = [
      new TabsPopup({
        className: "alltabs-item",
        filterFn: (tab) => !tab.pinned && !tab.hidden,
        popup: document.getElementById("alltabs-popup"),
        onPopulate: () => this._updateTabsVisibilityStatus(),
      }),
      new TabsPopup({
        filterFn: (tab) => tab.hidden && tab.soundPlaying,
        popup: document.getElementById("alltabs-popup"),
        insertBefore: document.getElementById("alltabs-popup-separator-3"),
      }),
      new TabsPopup({
        filterFn: (tab) => tab.hidden,
        popup: document.getElementById("alltabs_hiddenTabsMenu"),
      }),
    ];
    this._tabsPopups.forEach(popup => popup.handleEvent(event));
  }

  _setupEventListeners() {
    this.addEventListener("popupshowing", (event) => {
      if (event.target.getAttribute("id") == "alltabs_containersMenuTab") {
        createUserContextMenu(event, { useAccessKeys: false });
        return;
      } else if (event.target != this) {
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

        let showHiddenTabs = gBrowser.visibleTabs.length < gBrowser.tabs.length;
        document.getElementById("alltabs_hiddenTabs").hidden = !showHiddenTabs;
        document.getElementById("alltabs-popup-separator-3").hidden = !showHiddenTabs;

        this._initializeTabsPopups(event);
      }
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

  }
}