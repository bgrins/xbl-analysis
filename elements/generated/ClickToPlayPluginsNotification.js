class FirefoxClickToPlayPluginsNotification extends FirefoxPopupNotification {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox flex="1" align="stretch" class="click-to-play-plugins-notification-main-box" inherits="popupid">
<hbox class="click-to-play-plugins-notification-description-box" flex="1" align="start">
<description class="click-to-play-plugins-outer-description" flex="1">
<span anonid="click-to-play-plugins-notification-description">
</span>
<br>
</br>
<firefox-text-label class="text-link click-to-play-plugins-notification-link popup-notification-learnmore-link" anonid="click-to-play-plugins-notification-link">
</firefox-text-label>
</description>
</hbox>
<grid anonid="click-to-play-plugins-notification-center-box" class="click-to-play-plugins-notification-center-box">
<columns>
<column flex="1">
</column>
<column>
</column>
</columns>
<rows>
<children includes="row">
</children>
<hbox pack="start" anonid="plugin-notification-showbox">
<button label="&pluginNotification.showAll.label;" accesskey="&pluginNotification.showAll.accesskey;" class="plugin-notification-showbutton" oncommand="document.getBindingParent(this)._setState(2)">
</button>
</hbox>
</rows>
</grid>
<hbox anonid="button-container" class="click-to-play-plugins-notification-button-container" pack="center" align="center">
<button anonid="primarybutton" class="click-to-play-popup-button popup-notification-button" oncommand="document.getBindingParent(this)._onButton(this)" flex="1">
</button>
<button anonid="secondarybutton" default="true" highlight="true" class="click-to-play-popup-button popup-notification-button" oncommand="document.getBindingParent(this)._onButton(this);" flex="1">
</button>
</hbox>
<box hidden="true">
<children>
</children>
</box>
</vbox>`;
    let comment = document.createComment(
      "Creating firefox-click-to-play-plugins-notification"
    );
    this.prepend(comment);

    Object.defineProperty(this, "_states", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._states;
        return (this._states = {
          SINGLE: 0,
          MULTI_COLLAPSED: 1,
          MULTI_EXPANDED: 2
        });
      },
      set(val) {
        delete this._states;
        return (this._states = val);
      }
    });
    Object.defineProperty(this, "_primaryButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._primaryButton;
        return (this._primaryButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "primarybutton"
        ));
      },
      set(val) {
        delete this._primaryButton;
        return (this._primaryButton = val);
      }
    });
    Object.defineProperty(this, "_secondaryButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._secondaryButton;
        return (this._secondaryButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "secondarybutton"
        ));
      },
      set(val) {
        delete this._secondaryButton;
        return (this._secondaryButton = val);
      }
    });
    Object.defineProperty(this, "_buttonContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._buttonContainer;
        return (this._buttonContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "button-container"
        ));
      },
      set(val) {
        delete this._buttonContainer;
        return (this._buttonContainer = val);
      }
    });
    Object.defineProperty(this, "_brandShortName", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._brandShortName;
        return (this._brandShortName = document
          .getElementById("bundle_brand")
          .getString("brandShortName"));
      },
      set(val) {
        delete this._brandShortName;
        return (this._brandShortName = val);
      }
    });
    Object.defineProperty(this, "_items", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._items;
        return (this._items = []);
      },
      set(val) {
        delete this._items;
        return (this._items = val);
      }
    });

    const XUL_NS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    let sortedActions = [];
    for (let action of this.notification.options.pluginData.values()) {
      sortedActions.push(action);
    }
    sortedActions.sort((a, b) => a.pluginName.localeCompare(b.pluginName));

    for (let action of sortedActions) {
      let item = document.createElementNS(XUL_NS, "row");
      item.setAttribute("class", "plugin-popupnotification-centeritem");
      item.action = action;
      this.appendChild(item);
      this._items.push(item);
    }
    switch (this._items.length) {
      case 0:
        PopupNotifications._dismiss();
        break;
      case 1:
        this._setState(this._states.SINGLE);
        break;
      default:
        if (this.notification.options.primaryPlugin) {
          this._setState(this._states.MULTI_COLLAPSED);
        } else {
          this._setState(this._states.MULTI_EXPANDED);
        }
    }

    this.addEventListener("keypress", event => {
      undefined;
    });
  }
  disconnectedCallback() {}
  _setState(state) {
    var grid = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "click-to-play-plugins-notification-center-box"
    );

    if (this._states.SINGLE == state) {
      grid.hidden = true;
      this._setupSingleState();
      return;
    }

    let prePath = this.notification.options.principal.URI.prePath;
    this._setupDescription("pluginActivateMultiple.message", null, prePath);

    var showBox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "plugin-notification-showbox"
    );

    var dialogStrings = Services.strings.createBundle(
      "chrome://global/locale/dialog.properties"
    );
    this._primaryButton.label = dialogStrings.GetStringFromName(
      "button-accept"
    );
    this._primaryButton.setAttribute("default", "true");

    this._secondaryButton.label = dialogStrings.GetStringFromName(
      "button-cancel"
    );
    this._primaryButton.setAttribute("action", "_multiAccept");
    this._secondaryButton.setAttribute("action", "_cancel");

    grid.hidden = false;

    if (this._states.MULTI_COLLAPSED == state) {
      for (let child of this.childNodes) {
        if (child.tagName != "row") {
          continue;
        }
        child.hidden =
          this.notification.options.primaryPlugin !=
          child.action.permissionString;
      }
      showBox.hidden = false;
    } else {
      for (let child of this.childNodes) {
        if (child.tagName != "row") {
          continue;
        }
        child.hidden = false;
      }
      showBox.hidden = true;
    }
    this._setupLink(null);
  }
  _setupSingleState() {
    var action = this._items[0].action;
    var prePath = action.pluginPermissionPrePath;
    let chromeWin = window.QueryInterface(Ci.nsIDOMChromeWindow);
    let isWindowPrivate = PrivateBrowsingUtils.isWindowPrivate(chromeWin);

    let label, linkLabel, button1, button2;

    if (action.fallbackType == Ci.nsIObjectLoadingContent.PLUGIN_ACTIVE) {
      button1 = {
        label: "pluginBlockNow.label",
        accesskey: "pluginBlockNow.accesskey",
        action: "_singleBlock"
      };
      button2 = {
        label: "pluginContinue.label",
        accesskey: "pluginContinue.accesskey",
        action: "_singleContinue",
        default: true
      };
      switch (action.blocklistState) {
        case Ci.nsIBlocklistService.STATE_NOT_BLOCKED:
          label = "pluginEnabled.message";
          linkLabel = "pluginActivate.learnMore";
          break;

        case Ci.nsIBlocklistService.STATE_BLOCKED:
          Cu.reportError(Error("Cannot happen!"));
          break;

        case Ci.nsIBlocklistService.STATE_VULNERABLE_UPDATE_AVAILABLE:
          label = "pluginEnabledOutdated.message";
          linkLabel = "pluginActivate.updateLabel";
          break;

        case Ci.nsIBlocklistService.STATE_VULNERABLE_NO_UPDATE:
          label = "pluginEnabledVulnerable.message";
          linkLabel = "pluginActivate.riskLabel";
          break;

        default:
          Cu.reportError(Error("Unexpected blocklist state"));
      }

      // TODO: temporary compromise, remove this once bug 892487 is fixed
      if (isWindowPrivate) {
        this._buttonContainer.hidden = true;
      }
    } else if (
      action.pluginTag.enabledState == Ci.nsIPluginTag.STATE_DISABLED
    ) {
      let linkElement = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "click-to-play-plugins-notification-link"
      );
      linkElement.textContent = gNavigatorBundle.getString(
        "pluginActivateDisabled.manage"
      );
      linkElement.setAttribute("onclick", "gPluginHandler.managePlugins()");

      let descElement = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "click-to-play-plugins-notification-description"
      );
      descElement.textContent =
        gNavigatorBundle.getFormattedString("pluginActivateDisabled.message", [
          action.pluginName,
          this._brandShortName
        ]) + " ";
      this._buttonContainer.hidden = true;
      return;
    } else if (action.blocklistState == Ci.nsIBlocklistService.STATE_BLOCKED) {
      let descElement = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "click-to-play-plugins-notification-description"
      );
      descElement.textContent =
        gNavigatorBundle.getFormattedString("pluginActivateBlocked.message", [
          action.pluginName,
          this._brandShortName
        ]) + " ";
      this._setupLink("pluginActivate.learnMore", action.detailsLink);
      this._buttonContainer.hidden = true;
      return;
    } else {
      button1 = {
        label: "pluginActivateNow.label",
        accesskey: "pluginActivateNow.accesskey",
        action: "_singleActivateNow"
      };
      button2 = {
        label: "pluginActivateAlways.label",
        accesskey: "pluginActivateAlways.accesskey",
        action: "_singleActivateAlways"
      };
      switch (action.blocklistState) {
        case Ci.nsIBlocklistService.STATE_NOT_BLOCKED:
          label = "pluginActivate2.message";
          linkLabel = "pluginActivate.learnMore";
          button2.default = true;
          break;

        case Ci.nsIBlocklistService.STATE_VULNERABLE_UPDATE_AVAILABLE:
          label = "pluginActivateOutdated.message";
          linkLabel = "pluginActivate.updateLabel";
          button1.default = true;
          break;

        case Ci.nsIBlocklistService.STATE_VULNERABLE_NO_UPDATE:
          label = "pluginActivateVulnerable.message";
          linkLabel = "pluginActivate.riskLabel";
          button1.default = true;
          break;

        default:
          Cu.reportError(Error("Unexpected blocklist state"));
      }

      // TODO: temporary compromise, remove this once bug 892487 is fixed
      if (isWindowPrivate) {
        button1.default = true;
        this._secondaryButton.hidden = true;
      }
    }
    this._setupDescription(label, action.pluginName, prePath);
    this._setupLink(linkLabel, action.detailsLink);

    this._primaryButton.label = gNavigatorBundle.getString(button1.label);
    this._primaryButton.accessKey = gNavigatorBundle.getString(
      button1.accesskey
    );
    this._primaryButton.setAttribute("action", button1.action);

    this._secondaryButton.label = gNavigatorBundle.getString(button2.label);
    this._secondaryButton.accessKey = gNavigatorBundle.getString(
      button2.accesskey
    );
    this._secondaryButton.setAttribute("action", button2.action);
    if (button1.default) {
      this._primaryButton.setAttribute("default", "true");
    } else if (button2.default) {
      this._secondaryButton.setAttribute("default", "true");
    }

    if (this._primaryButton.hidden) {
      this._secondaryButton.setAttribute("alone", "true");
    } else if (this._secondaryButton.hidden) {
      this._primaryButton.setAttribute("alone", "true");
    }
  }
  _setupDescription(baseString, pluginName, prePath) {
    var span = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "click-to-play-plugins-notification-description"
    );
    while (span.lastChild) {
      span.removeChild(span.lastChild);
    }

    var args = ["__prepath__", this._brandShortName];
    if (pluginName) {
      args.unshift(pluginName);
    }
    var bases = gNavigatorBundle
      .getFormattedString(baseString, args)
      .split("__prepath__", 2);

    span.appendChild(document.createTextNode(bases[0]));
    var prePathSpan = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "em"
    );
    prePathSpan.appendChild(document.createTextNode(prePath));
    span.appendChild(prePathSpan);
    span.appendChild(document.createTextNode(bases[1] + " "));
  }
  _setupLink(linkString, linkUrl) {
    var link = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "click-to-play-plugins-notification-link"
    );
    if (!linkString || !linkUrl) {
      link.hidden = true;
      return;
    }

    link.hidden = false;
    link.textContent = gNavigatorBundle.getString(linkString);
    link.href = linkUrl;
  }
  _onButton(aButton) {
    let methodName = aButton.getAttribute("action");
    this[methodName]();
  }
  _singleActivateNow() {
    gPluginHandler._updatePluginPermission(
      this.notification,
      this._items[0].action,
      "allownow"
    );
    this._cancel();
  }
  _singleBlock() {
    gPluginHandler._updatePluginPermission(
      this.notification,
      this._items[0].action,
      "block"
    );
    this._cancel();
  }
  _singleActivateAlways() {
    gPluginHandler._updatePluginPermission(
      this.notification,
      this._items[0].action,
      "allowalways"
    );
    this._cancel();
  }
  _singleContinue() {
    gPluginHandler._updatePluginPermission(
      this.notification,
      this._items[0].action,
      "continue"
    );
    this._cancel();
  }
  _multiAccept() {
    for (let item of this._items) {
      let action = item.action;
      if (
        action.pluginTag.enabledState == Ci.nsIPluginTag.STATE_DISABLED ||
        action.blocklistState == Ci.nsIBlocklistService.STATE_BLOCKED
      ) {
        continue;
      }
      gPluginHandler._updatePluginPermission(
        this.notification,
        item.action,
        item.value
      );
    }
    this._cancel();
  }
  _cancel() {
    PopupNotifications._dismiss();
  }
  _accept(aEvent) {
    if (aEvent.defaultPrevented) return;
    aEvent.preventDefault();
    if (this._primaryButton.getAttribute("default") == "true") {
      this._primaryButton.click();
    } else if (this._secondaryButton.getAttribute("default") == "true") {
      this._secondaryButton.click();
    }
  }
}
customElements.define(
  "firefox-click-to-play-plugins-notification",
  FirefoxClickToPlayPluginsNotification
);
