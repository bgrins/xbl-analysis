class FirefoxBrowserSearchAutocompleteResultPopup extends FirefoxAutocompleteResultPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox anonid="searchbar-engine" inherits="showonlysettings" class="search-panel-header search-panel-current-engine">
<image class="searchbar-engine-image" inherits="src">
</image>
<firefox-text-label anonid="searchbar-engine-name" flex="1" crop="end" role="presentation">
</firefox-text-label>
</hbox>
<tree anonid="tree" flex="1" class="autocomplete-tree plain search-panel-tree" hidecolumnpicker="true" seltype="single">
<treecols anonid="treecols">
<treecol id="treecolAutoCompleteValue" class="autocomplete-treecol" flex="1" overflow="true">
</treecol>
</treecols>
<treechildren class="autocomplete-treebody searchbar-treebody">
</treechildren>
</tree>
<vbox anonid="search-one-off-buttons" class="search-one-offs">
</vbox>`;
    let comment = document.createComment(
      "Creating firefox-browser-search-autocomplete-result-popup"
    );
    this.prepend(comment);

    Object.defineProperty(this, "_isHiding", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._isHiding;
        return (this._isHiding = false);
      },
      set(val) {
        delete this._isHiding;
        return (this._isHiding = val);
      }
    });
    Object.defineProperty(this, "_bundle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._bundle;
        return (this._bundle = null);
      },
      set(val) {
        delete this._bundle;
        return (this._bundle = val);
      }
    });
    Object.defineProperty(this, "oneOffButtons", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.oneOffButtons;
        return (this.oneOffButtons = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "search-one-off-buttons"
        ));
      }
    });

    this.addEventListener("popupshowing", event => {
      // Force the panel to have the width of the searchbar rather than
      // the width of the textfield.
      let DOMUtils = window
        .QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface(Ci.nsIDOMWindowUtils);
      let textboxRect = DOMUtils.getBoundsWithoutFlushing(this.mInput);
      let inputRect = DOMUtils.getBoundsWithoutFlushing(this.mInput.inputField);

      // Ensure the panel is wide enough to fit at least 3 engines.
      let minWidth = Math.max(
        textboxRect.width,
        this.oneOffButtons.buttonWidth * 3
      );
      this.style.minWidth = Math.round(minWidth) + "px";
      // Alignment of the panel with the searchbar is obtained with negative
      // margins.
      this.style.marginLeft = textboxRect.left - inputRect.left + "px";
      // This second margin is needed when the direction is reversed,
      // eg. when using command+shift+X.
      this.style.marginRight = inputRect.right - textboxRect.right + "px";

      // First handle deciding if we are showing the reduced version of the
      // popup containing only the preferences button. We do this if the
      // glass icon has been clicked if the text field is empty.
      let searchbar = document.getElementById("searchbar");
      if (searchbar.hasAttribute("showonlysettings")) {
        searchbar.removeAttribute("showonlysettings");
        this.setAttribute("showonlysettings", "true");

        // Setting this with an xbl-inherited attribute gets overridden the
        // second time the user clicks the glass icon for some reason...
        this.tree.collapsed = true;
      } else {
        this.removeAttribute("showonlysettings");
        // Uncollapse as long as we have a tree with a view which has >= 1 row.
        // The autocomplete binding itself will take care of uncollapsing later,
        // if we currently have no rows but end up having some in the future
        // when the search string changes
        this.tree.collapsed = !this.tree.view || !this.tree.view.rowCount;
      }

      // Show the current default engine in the top header of the panel.
      this.updateHeader();
    });

    this.addEventListener("popuphiding", event => {
      this._isHiding = true;
      Services.tm.dispatchToMainThread(() => {
        this._isHiding = false;
      });
    });

    this.addEventListener("click", event => {
      if (event.button == 2) {
        // Ignore right clicks.
        return;
      }
      let button = event.originalTarget;
      let engine = button.parentNode.engine;
      if (!engine) {
        return;
      }
      this.oneOffButtons.handleSearchCommand(event, engine);
    });
  }
  disconnectedCallback() {}

  get bundle() {
    if (!this._bundle) {
      const kBundleURI = "chrome://browser/locale/search.properties";
      this._bundle = Services.strings.createBundle(kBundleURI);
    }
    return this._bundle;
  }
  openAutocompletePopup(aInput, aElement) {
    // initially the panel is hidden
    // to avoid impacting startup / new window performance
    aInput.popup.hidden = false;

    // this method is defined on the base binding
    this._openAutocompletePopup(aInput, aElement);
  }
  onPopupClick(aEvent) {
    // Ignore all right-clicks
    if (aEvent.button == 2) return;

    var controller = this.view.QueryInterface(
      Components.interfaces.nsIAutoCompleteController
    );

    var searchBar = BrowserSearch.searchBar;
    var popupForSearchBar = searchBar && searchBar.textbox == this.mInput;
    if (popupForSearchBar) {
      searchBar.telemetrySearchDetails = {
        index: controller.selection.currentIndex,
        kind: "mouse"
      };
    }

    // Check for unmodified left-click, and use default behavior
    if (
      aEvent.button == 0 &&
      !aEvent.shiftKey &&
      !aEvent.ctrlKey &&
      !aEvent.altKey &&
      !aEvent.metaKey
    ) {
      controller.handleEnter(true, aEvent);
      return;
    }

    // Check for middle-click or modified clicks on the search bar
    if (popupForSearchBar) {
      BrowserUsageTelemetry.recordSearchbarSelectedResultMethod(
        aEvent,
        this.selectedIndex
      );

      // Handle search bar popup clicks
      var search = controller.getValueAt(this.selectedIndex);

      // open the search results according to the clicking subtlety
      var where = whereToOpenLink(aEvent, false, true);
      let params = {};

      // But open ctrl/cmd clicks on autocomplete items in a new background tab.
      let modifier = AppConstants.platform == "macosx"
        ? aEvent.metaKey
        : aEvent.ctrlKey;
      if (
        where == "tab" &&
        aEvent instanceof MouseEvent &&
        (aEvent.button == 1 || modifier)
      )
        params.inBackground = true;

      // leave the popup open for background tab loads
      if (!(where == "tab" && params.inBackground)) {
        // close the autocomplete popup and revert the entered search term
        this.closePopup();
        controller.handleEscape();
      }

      searchBar.doSearch(search, where, null, params);
      if (where == "tab" && params.inBackground) searchBar.focus();
      else searchBar.value = search;
    }
  }
  updateHeader() {
    let currentEngine = Services.search.currentEngine;
    let uri = currentEngine.iconURI;
    if (uri) {
      this.setAttribute("src", uri.spec);
    } else {
      // If the default has just been changed to a provider without icon,
      // avoid showing the icon of the previous default provider.
      this.removeAttribute("src");
    }

    let headerText = this.bundle.formatStringFromName(
      "searchHeader",
      [currentEngine.name],
      1
    );
    document
      .getAnonymousElementByAttribute(this, "anonid", "searchbar-engine-name")
      .setAttribute("value", headerText);
    document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "searchbar-engine"
    ).engine = currentEngine;
  }
  handleOneOffSearch(event, engine, where, params) {
    let searchbar = document.getElementById("searchbar");
    searchbar.handleSearchCommandWhere(event, engine, where, params);
  }
}
customElements.define(
  "firefox-browser-search-autocomplete-result-popup",
  FirefoxBrowserSearchAutocompleteResultPopup
);
