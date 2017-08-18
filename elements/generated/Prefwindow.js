class FirefoxPrefwindow extends FirefoxDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<windowdragbox orient="vertical">
<radiogroup anonid="selector" orient="horizontal" class="paneSelector chromeclass-toolbar" role="listbox">
</radiogroup>
</windowdragbox>
<hbox flex="1" class="paneDeckContainer">
<deck anonid="paneDeck" flex="1">
<children includes="prefpane">
</children>
</deck>
</hbox>
<hbox anonid="dlg-buttons" class="prefWindow-dlgbuttons" pack="end">
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
<button dlgtype="help" class="dialog-button" hidden="true" icon="help">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1">
</spacer>
<button dlgtype="cancel" class="dialog-button" icon="cancel">
</button>
<button dlgtype="accept" class="dialog-button" icon="accept">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1">
</spacer>
<button dlgtype="accept" class="dialog-button" icon="accept">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<button dlgtype="cancel" class="dialog-button" icon="cancel">
</button>
<button dlgtype="help" class="dialog-button" hidden="true" icon="help">
</button>
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
</hbox>
<hbox>
<children>
</children>
</hbox>`;
    let comment = document.createComment("Creating firefox-prefwindow");
    this.prepend(comment);

    try {
      if (this.type != "child") {
        if (!this._instantApplyInitialized) {
          let psvc = Components.classes[
            "@mozilla.org/preferences-service;1"
          ].getService(Components.interfaces.nsIPrefBranch);
          this.instantApply = psvc.getBoolPref(
            "browser.preferences.instantApply"
          );
        }
        if (this.instantApply) {
          var docElt = document.documentElement;
          var acceptButton = docElt.getButton("accept");
          acceptButton.hidden = true;
          var cancelButton = docElt.getButton("cancel");
          if (/Mac/.test(navigator.platform)) {
            // no buttons on Mac except Help
            cancelButton.hidden = true;
            // Move Help button to the end
            document.getAnonymousElementByAttribute(
              this,
              "anonid",
              "spacer"
            ).hidden = true;
            // Also, don't fire onDialogAccept on enter
            acceptButton.disabled = true;
          } else {
            // morph the Cancel button into the Close button
            cancelButton.setAttribute("icon", "close");
            cancelButton.label = docElt.getAttribute("closebuttonlabel");
            cancelButton.accesskey = docElt.getAttribute(
              "closebuttonaccesskey"
            );
          }
        }
      }
      this.setAttribute("animated", this._shouldAnimate ? "true" : "false");
      var panes = this.preferencePanes;

      var lastPane = null;
      if (this.lastSelected) {
        lastPane = document.getElementById(this.lastSelected);
        if (!lastPane) {
          this.lastSelected = "";
        }
      }

      var paneToLoad;
      if (
        "arguments" in window &&
        window.arguments[0] &&
        document.getElementById(window.arguments[0]) &&
        document.getElementById(window.arguments[0]).nodeName == "prefpane"
      ) {
        paneToLoad = document.getElementById(window.arguments[0]);
        this.lastSelected = paneToLoad.id;
      } else if (lastPane) paneToLoad = lastPane;
      else paneToLoad = panes[0];

      for (var i = 0; i < panes.length; ++i) {
        this._makePaneButton(panes[i]);
        if (panes[i].loaded) {
          // Inline pane content, fire load event to force initialization.
          this._fireEvent("paneload", panes[i]);
        }
      }
      this.showPane(paneToLoad);

      if (panes.length == 1) this._selector.setAttribute("collapsed", "true");
    } catch (e) {}
    this._instantApplyInitialized = false;
    this.instantApply = false;
    this._currentPane = null;
    this._initialized = false;
    this._animateTimer = null;
    this._fadeTimer = null;
    this._animateDelay = 15;
    this._animateIncrement = 40;
    this._fadeDelay = 5;
    this._fadeIncrement = 0.4;
    this._animateRemainder = 0;
    this._currentHeight = 0;
    this._multiplier = 0;
  }
  disconnectedCallback() {}

  get preferencePanes() {
    return this.getElementsByTagName("prefpane");
  }

  get type() {
    return this.getAttribute("type");
  }

  get _paneDeck() {
    return document.getAnonymousElementByAttribute(this, "anonid", "paneDeck");
  }

  get _paneDeckContainer() {
    return document.getAnonymousElementByAttribute(
      this,
      "class",
      "paneDeckContainer"
    );
  }

  get _selector() {
    return document.getAnonymousElementByAttribute(this, "anonid", "selector");
  }

  set lastSelected(val) {
    undefined;
  }

  get lastSelected() {
    return this.getAttribute("lastSelected");
  }

  set currentPane(val) {
    return (this._currentPane = val);
  }

  get currentPane() {
    undefined;
  }

  get _shouldAnimate() {
    var psvc = Components.classes[
      "@mozilla.org/preferences-service;1"
    ].getService(Components.interfaces.nsIPrefBranch);
    return psvc.getBoolPref(
      "browser.preferences.animateFadeIn",
      /Mac/.test(navigator.platform)
    );
  }

  get _sizeIncrement() {
    var lastSelectedPane = document.getElementById(this.lastSelected);
    var increment = this._animateIncrement * this._multiplier;
    var newHeight = this._currentHeight + increment;
    if (
      (this._multiplier > 0 &&
        this._currentHeight >= lastSelectedPane.contentHeight) ||
      (this._multiplier < 0 &&
        this._currentHeight <= lastSelectedPane.contentHeight)
    )
      return 0;

    if (
      (this._multiplier > 0 && newHeight > lastSelectedPane.contentHeight) ||
      (this._multiplier < 0 && newHeight < lastSelectedPane.contentHeight)
    )
      increment = this._animateRemainder * this._multiplier;
    return increment;
  }
  _makePaneButton(aPaneElement) {
    var radio = document.createElement("radio");
    radio.setAttribute("pane", aPaneElement.id);
    radio.setAttribute("label", aPaneElement.label);
    // Expose preference group choice to accessibility APIs as an unchecked list item
    // The parent group is exposed to accessibility APIs as a list
    if (aPaneElement.image) radio.setAttribute("src", aPaneElement.image);
    radio.style.listStyleImage = aPaneElement.style.listStyleImage;
    this._selector.appendChild(radio);
    return radio;
  }
  showPane(aPaneElement) {
    if (!aPaneElement) return;

    this._selector.selectedItem = document.getAnonymousElementByAttribute(
      this,
      "pane",
      aPaneElement.id
    );
    if (!aPaneElement.loaded) {
      let OverlayLoadObserver = function(aPane) {
        this._pane = aPane;
      };
      OverlayLoadObserver.prototype = {
        _outer: this,
        observe(aSubject, aTopic, aData) {
          this._pane.loaded = true;
          this._outer._fireEvent("paneload", this._pane);
          this._outer._selectPane(this._pane);
        }
      };

      var obs = new OverlayLoadObserver(aPaneElement);
      document.loadOverlay(aPaneElement.src, obs);
    } else this._selectPane(aPaneElement);
  }
  _fireEvent(aEventName, aTarget) {
    // Panel loaded, synthesize a load event.
    try {
      var event = document.createEvent("Events");
      event.initEvent(aEventName, true, true);
      var cancel = !aTarget.dispatchEvent(event);
      if (aTarget.hasAttribute("on" + aEventName)) {
        var fn = new Function("event", aTarget.getAttribute("on" + aEventName));
        var rv = fn.call(aTarget, event);
        if (rv == false) cancel = true;
      }
      return !cancel;
    } catch (e) {
      Components.utils.reportError(e);
    }
    return false;
  }
  _selectPane(aPaneElement) {
    if (/Mac/.test(navigator.platform)) {
      var paneTitle = aPaneElement.label;
      if (paneTitle != "") document.title = paneTitle;
    }
    var helpButton = document.documentElement.getButton("help");
    if (aPaneElement.helpTopic) helpButton.hidden = false;
    else helpButton.hidden = true;

    // Find this pane's index in the deck and set the deck's
    // selectedIndex to that value to switch to it.
    var prefpanes = this.preferencePanes;
    for (var i = 0; i < prefpanes.length; ++i) {
      if (prefpanes[i] == aPaneElement) {
        this._paneDeck.selectedIndex = i;

        if (this.type != "child") {
          if (
            aPaneElement.hasAttribute("flex") &&
            this._shouldAnimate &&
            prefpanes.length > 1
          )
            aPaneElement.removeAttribute("flex");
          // Calling sizeToContent after the first prefpane is loaded
          // will size the windows contents so style information is
          // available to calculate correct sizing.
          if (!this._initialized && prefpanes.length > 1) {
            if (this._shouldAnimate) this.style.minHeight = 0;
            window.sizeToContent();
          }

          var oldPane = this.lastSelected
            ? document.getElementById(this.lastSelected)
            : this.preferencePanes[0];
          oldPane.selected = !(aPaneElement.selected = true);
          this.lastSelected = aPaneElement.id;
          this.currentPane = aPaneElement;
          this._initialized = true;

          // Only animate if we've switched between prefpanes
          if (this._shouldAnimate && oldPane.id != aPaneElement.id) {
            aPaneElement.style.opacity = 0.0;
            this.animate(oldPane, aPaneElement);
          } else if (!this._shouldAnimate && prefpanes.length > 1) {
            var targetHeight = parseInt(
              window.getComputedStyle(this._paneDeckContainer).height
            );
            var verticalPadding = parseInt(
              window.getComputedStyle(aPaneElement).paddingTop
            );
            verticalPadding += parseInt(
              window.getComputedStyle(aPaneElement).paddingBottom
            );
            if (aPaneElement.contentHeight > targetHeight - verticalPadding) {
              // To workaround the bottom border of a groupbox from being
              // cutoff an hbox with a class of bottomBox may enclose it.
              // This needs to include its padding to resize properly.
              // See bug 394433
              var bottomPadding = 0;
              var bottomBox = aPaneElement.getElementsByAttribute(
                "class",
                "bottomBox"
              )[0];
              if (bottomBox)
                bottomPadding = parseInt(
                  window.getComputedStyle(bottomBox).paddingBottom
                );
              window.innerHeight +=
                bottomPadding +
                verticalPadding +
                aPaneElement.contentHeight -
                targetHeight;
            }

            // XXX rstrong - extend the contents of the prefpane to
            // prevent elements from being cutoff (see bug 349098).
            if (aPaneElement.contentHeight + verticalPadding < targetHeight)
              aPaneElement._content.style.height =
                targetHeight - verticalPadding + "px";
          }
        }
        break;
      }
    }
  }
  animate(aOldPane, aNewPane) {
    // if we are already resizing, use currentHeight
    var oldHeight = this._currentHeight
      ? this._currentHeight
      : aOldPane.contentHeight;

    this._multiplier = aNewPane.contentHeight > oldHeight ? 1 : -1;
    var sizeDelta = Math.abs(oldHeight - aNewPane.contentHeight);
    this._animateRemainder = sizeDelta % this._animateIncrement;

    this._setUpAnimationTimer(oldHeight);
  }
  notify(aTimer) {
    if (!document) aTimer.cancel();

    if (aTimer == this._animateTimer) {
      var increment = this._sizeIncrement;
      if (increment != 0) {
        window.innerHeight += increment;
        this._currentHeight += increment;
      } else {
        aTimer.cancel();
        this._setUpFadeTimer();
      }
    } else if (aTimer == this._fadeTimer) {
      var elt = document.getElementById(this.lastSelected);
      var newOpacity =
        parseFloat(window.getComputedStyle(elt).opacity) + this._fadeIncrement;
      if (newOpacity < 1.0) elt.style.opacity = newOpacity;
      else {
        aTimer.cancel();
        elt.style.opacity = 1.0;
      }
    }
  }
  _setUpAnimationTimer(aStartHeight) {
    if (!this._animateTimer)
      this._animateTimer = Components.classes[
        "@mozilla.org/timer;1"
      ].createInstance(Components.interfaces.nsITimer);
    else this._animateTimer.cancel();
    this._currentHeight = aStartHeight;

    this._animateTimer.initWithCallback(
      this,
      this._animateDelay,
      Components.interfaces.nsITimer.TYPE_REPEATING_SLACK
    );
  }
  _setUpFadeTimer() {
    if (!this._fadeTimer)
      this._fadeTimer = Components.classes[
        "@mozilla.org/timer;1"
      ].createInstance(Components.interfaces.nsITimer);
    else this._fadeTimer.cancel();

    this._fadeTimer.initWithCallback(
      this,
      this._fadeDelay,
      Components.interfaces.nsITimer.TYPE_REPEATING_SLACK
    );
  }
  addPane(aPaneElement) {
    this.appendChild(aPaneElement);

    // Set up pane button
    this._makePaneButton(aPaneElement);
  }
  openSubDialog(aURL, aFeatures, aParams) {}
  openWindow(aWindowType, aURL, aFeatures, aParams) {
    var wm = Components.classes[
      "@mozilla.org/appshell/window-mediator;1"
    ].getService(Components.interfaces.nsIWindowMediator);
    var win = aWindowType ? wm.getMostRecentWindow(aWindowType) : null;
    if (win) {
      if ("initWithParams" in win) win.initWithParams(aParams);
      win.focus();
    } else {
      var features =
        "resizable,dialog=no,centerscreen" +
        (aFeatures != "" ? "," + aFeatures : "");
      var parentWindow = this.instantApply ||
        !window.opener ||
        window.opener.closed
        ? window
        : window.opener;
      win = parentWindow.openDialog(aURL, "_blank", features, aParams);
    }
    return win;
  }
}
customElements.define("firefox-prefwindow", FirefoxPrefwindow);
