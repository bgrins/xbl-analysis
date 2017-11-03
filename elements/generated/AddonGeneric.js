class FirefoxAddonGeneric extends FirefoxAddonBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox anonid="warning-container" class="warning">
        <xul:image class="warning-icon"></xul:image>
        <xul:label anonid="warning" flex="1"></xul:label>
        <xul:label anonid="warning-link" class="text-link"></xul:label>
        <xul:button anonid="warning-btn" class="button-link" hidden="true"></xul:button>
        <xul:spacer flex="5000"></xul:spacer>
      </xul:hbox>
      <xul:hbox anonid="error-container" class="error">
        <xul:image class="error-icon"></xul:image>
        <xul:label anonid="error" flex="1"></xul:label>
        <xul:label anonid="error-link" class="text-link" hidden="true"></xul:label>
        <xul:spacer flex="5000"></xul:spacer>
      </xul:hbox>
      <xul:hbox anonid="pending-container" class="pending">
        <xul:image class="pending-icon"></xul:image>
        <xul:label anonid="pending" flex="1"></xul:label>
        <xul:button anonid="restart-btn" class="button-link" label="FROM-DTD-addon-restartNow-label" oncommand="document.getBindingParent(this).restart();"></xul:button>
        <xul:button anonid="undo-btn" class="button-link" label="FROM-DTD-addon-undoAction-label" tooltipText="FROM-DTD-addon-undoAction-tooltip" oncommand="document.getBindingParent(this).undo();"></xul:button>
        <xul:spacer flex="5000"></xul:spacer>
      </xul:hbox>
      <xul:hbox class="content-container" align="center">
        <xul:vbox class="icon-container">
          <xul:image anonid="icon" class="icon"></xul:image>
        </xul:vbox>
        <xul:vbox class="content-inner-container" flex="1">
          <xul:hbox class="basicinfo-container">
            <xul:hbox class="name-container">
              <xul:label anonid="name" class="name" crop="end" flex="1" tooltip="addonitem-tooltip" inherits="value=name"></xul:label>
              <xul:label anonid="legacy" class="legacy-warning text-link" value="FROM-DTD-addon-legacy-label"></xul:label>
              <xul:label class="disabled-postfix" value="FROM-DTD-addon-disabled-postfix"></xul:label>
              <xul:label class="update-postfix" value="FROM-DTD-addon-update-postfix"></xul:label>
              <xul:spacer flex="5000"></xul:spacer>
            </xul:hbox>
            <xul:label anonid="date-updated" class="date-updated" unknown="FROM-DTD-addon-unknownDate"></xul:label>
          </xul:hbox>
          <xul:hbox class="experiment-container">
            <svg width="6" height="6" viewBox="0 0 6 6" version="1.1" xmlns="http://www.w3.org/2000/svg" class="experiment-bullet-container">
              <circle cx="3" cy="3" r="3" class="experiment-bullet"></circle>
            </svg>
            <xul:label anonid="experiment-state" class="experiment-state"></xul:label>
            <xul:label anonid="experiment-time" class="experiment-time"></xul:label>
          </xul:hbox>
          <xul:hbox class="advancedinfo-container" flex="1">
            <xul:vbox class="description-outer-container" flex="1">
              <xul:hbox class="description-container">
                <xul:label anonid="description" class="description" crop="end" flex="1"></xul:label>
                <xul:button anonid="details-btn" class="details button-link" label="FROM-DTD-addon-details-label" tooltiptext="FROM-DTD-addon-details-tooltip" oncommand="document.getBindingParent(this).showInDetailView();"></xul:button>
                <xul:spacer flex="5000"></xul:spacer>
              </xul:hbox>
              <xul:vbox anonid="relnotes-container" class="relnotes-container">
                <xul:label class="relnotes-header" value="FROM-DTD-addon-releaseNotes-label"></xul:label>
                <xul:label anonid="relnotes-loading" value="FROM-DTD-addon-loadingReleaseNotes-label"></xul:label>
                <xul:label anonid="relnotes-error" hidden="true" value="FROM-DTD-addon-errorLoadingReleaseNotes-label"></xul:label>
                <xul:vbox anonid="relnotes" class="relnotes"></xul:vbox>
              </xul:vbox>
              <xul:hbox class="relnotes-toggle-container">
                <xul:button anonid="relnotes-toggle-btn" class="relnotes-toggle" hidden="true" label="FROM-DTD-cmd-showReleaseNotes-label" tooltiptext="FROM-DTD-cmd-showReleaseNotes-tooltip" showlabel="FROM-DTD-cmd-showReleaseNotes-label" showtooltip="FROM-DTD-cmd-showReleaseNotes-tooltip" hidelabel="FROM-DTD-cmd-hideReleaseNotes-label" hidetooltip="FROM-DTD-cmd-hideReleaseNotes-tooltip" oncommand="document.getBindingParent(this).toggleReleaseNotes();"></xul:button>
              </xul:hbox>
            </xul:vbox>
          </xul:hbox>
        </xul:vbox>
        <xul:vbox class="status-control-wrapper">
          <xul:hbox class="status-container">
            <xul:hbox anonid="checking-update" hidden="true">
              <xul:image class="spinner"></xul:image>
              <xul:label value="FROM-DTD-addon-checkingForUpdates-label"></xul:label>
            </xul:hbox>
            <xul:vbox anonid="update-available" class="update-available" hidden="true">
              <xul:checkbox anonid="include-update" class="include-update" label="FROM-DTD-addon-includeUpdate-label" checked="true" oncommand="document.getBindingParent(this).onIncludeUpdateChanged();"></xul:checkbox>
              <xul:hbox class="update-info-container">
                <xul:label class="update-available-notice" value="FROM-DTD-addon-updateAvailable-label"></xul:label>
                <xul:button anonid="update-btn" class="addon-control update" label="FROM-DTD-addon-updateNow-label" tooltiptext="FROM-DTD-addon-updateNow-tooltip" oncommand="document.getBindingParent(this).upgrade();"></xul:button>
              </xul:hbox>
            </xul:vbox>
            <xul:hbox anonid="install-status" class="install-status" hidden="true"></xul:hbox>
          </xul:hbox>
          <xul:hbox anonid="control-container" class="control-container">
            <xul:button anonid="preferences-btn" class="addon-control preferences" label="FROM-DTD-cmd-showPreferencesWin-label" tooltiptext="FROM-DTD-cmd-showPreferencesWin-tooltip" oncommand="document.getBindingParent(this).showPreferences();"></xul:button>
            <xul:button anonid="enable-btn" class="addon-control enable" label="FROM-DTD-cmd-enableAddon-label" oncommand="document.getBindingParent(this).userDisabled = false;"></xul:button>
            <xul:button anonid="disable-btn" class="addon-control disable" label="FROM-DTD-cmd-disableAddon-label" oncommand="document.getBindingParent(this).userDisabled = true;"></xul:button>
            <xul:button anonid="replacement-btn" class="addon-control replacement" label="FROM-DTD-cmd-findReplacement-label" oncommand="document.getBindingParent(this).findReplacement();"></xul:button>
            <xul:button anonid="remove-btn" class="addon-control remove" label="FROM-DTD-cmd-uninstallAddon-label" oncommand="document.getBindingParent(this).uninstall();"></xul:button>
            <xul:menulist anonid="state-menulist" class="addon-control state" tooltiptext="FROM-DTD-cmd-stateMenu-tooltip">
              <xul:menupopup>
                <xul:menuitem anonid="ask-to-activate-menuitem" class="addon-control" label="FROM-DTD-cmd-askToActivate-label" tooltiptext="FROM-DTD-cmd-askToActivate-tooltip" oncommand="document.getBindingParent(this).userDisabled = AddonManager.STATE_ASK_TO_ACTIVATE;"></xul:menuitem>
                <xul:menuitem anonid="always-activate-menuitem" class="addon-control" label="FROM-DTD-cmd-alwaysActivate-label" tooltiptext="FROM-DTD-cmd-alwaysActivate-tooltip" oncommand="document.getBindingParent(this).userDisabled = false;"></xul:menuitem>
                <xul:menuitem anonid="never-activate-menuitem" class="addon-control" label="FROM-DTD-cmd-neverActivate-label" tooltiptext="FROM-DTD-cmd-neverActivate-tooltip" oncommand="document.getBindingParent(this).userDisabled = true;"></xul:menuitem>
              </xul:menupopup>
            </xul:menulist>
          </xul:hbox>
        </xul:vbox>
      </xul:hbox>
    `;
    Object.defineProperty(this, "_warningContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._warningContainer;
        return (this._warningContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "warning-container"
        ));
      },
      set(val) {
        delete this._warningContainer;
        return (this._warningContainer = val);
      }
    });
    Object.defineProperty(this, "_warning", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._warning;
        return (this._warning = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "warning"
        ));
      },
      set(val) {
        delete this._warning;
        return (this._warning = val);
      }
    });
    Object.defineProperty(this, "_warningLink", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._warningLink;
        return (this._warningLink = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "warning-link"
        ));
      },
      set(val) {
        delete this._warningLink;
        return (this._warningLink = val);
      }
    });
    Object.defineProperty(this, "_warningBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._warningBtn;
        return (this._warningBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "warning-btn"
        ));
      },
      set(val) {
        delete this._warningBtn;
        return (this._warningBtn = val);
      }
    });
    Object.defineProperty(this, "_errorContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._errorContainer;
        return (this._errorContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "error-container"
        ));
      },
      set(val) {
        delete this._errorContainer;
        return (this._errorContainer = val);
      }
    });
    Object.defineProperty(this, "_error", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._error;
        return (this._error = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "error"
        ));
      },
      set(val) {
        delete this._error;
        return (this._error = val);
      }
    });
    Object.defineProperty(this, "_errorLink", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._errorLink;
        return (this._errorLink = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "error-link"
        ));
      },
      set(val) {
        delete this._errorLink;
        return (this._errorLink = val);
      }
    });
    Object.defineProperty(this, "_pendingContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._pendingContainer;
        return (this._pendingContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "pending-container"
        ));
      },
      set(val) {
        delete this._pendingContainer;
        return (this._pendingContainer = val);
      }
    });
    Object.defineProperty(this, "_pending", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._pending;
        return (this._pending = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "pending"
        ));
      },
      set(val) {
        delete this._pending;
        return (this._pending = val);
      }
    });
    Object.defineProperty(this, "_infoContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._infoContainer;
        return (this._infoContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "info-container"
        ));
      },
      set(val) {
        delete this._infoContainer;
        return (this._infoContainer = val);
      }
    });
    Object.defineProperty(this, "_info", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._info;
        return (this._info = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "info"
        ));
      },
      set(val) {
        delete this._info;
        return (this._info = val);
      }
    });
    Object.defineProperty(this, "_experimentState", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._experimentState;
        return (this._experimentState = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "experiment-state"
        ));
      },
      set(val) {
        delete this._experimentState;
        return (this._experimentState = val);
      }
    });
    Object.defineProperty(this, "_experimentTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._experimentTime;
        return (this._experimentTime = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "experiment-time"
        ));
      },
      set(val) {
        delete this._experimentTime;
        return (this._experimentTime = val);
      }
    });
    Object.defineProperty(this, "_icon", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._icon;
        return (this._icon = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "icon"
        ));
      },
      set(val) {
        delete this._icon;
        return (this._icon = val);
      }
    });
    Object.defineProperty(this, "_dateUpdated", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dateUpdated;
        return (this._dateUpdated = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "date-updated"
        ));
      },
      set(val) {
        delete this._dateUpdated;
        return (this._dateUpdated = val);
      }
    });
    Object.defineProperty(this, "_description", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._description;
        return (this._description = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "description"
        ));
      },
      set(val) {
        delete this._description;
        return (this._description = val);
      }
    });
    Object.defineProperty(this, "_stateMenulist", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._stateMenulist;
        return (this._stateMenulist = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "state-menulist"
        ));
      },
      set(val) {
        delete this._stateMenulist;
        return (this._stateMenulist = val);
      }
    });
    Object.defineProperty(this, "_askToActivateMenuitem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._askToActivateMenuitem;
        return (this._askToActivateMenuitem = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "ask-to-activate-menuitem"
        ));
      },
      set(val) {
        delete this._askToActivateMenuitem;
        return (this._askToActivateMenuitem = val);
      }
    });
    Object.defineProperty(this, "_alwaysActivateMenuitem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._alwaysActivateMenuitem;
        return (this._alwaysActivateMenuitem = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "always-activate-menuitem"
        ));
      },
      set(val) {
        delete this._alwaysActivateMenuitem;
        return (this._alwaysActivateMenuitem = val);
      }
    });
    Object.defineProperty(this, "_neverActivateMenuitem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._neverActivateMenuitem;
        return (this._neverActivateMenuitem = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "never-activate-menuitem"
        ));
      },
      set(val) {
        delete this._neverActivateMenuitem;
        return (this._neverActivateMenuitem = val);
      }
    });
    Object.defineProperty(this, "_preferencesBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._preferencesBtn;
        return (this._preferencesBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "preferences-btn"
        ));
      },
      set(val) {
        delete this._preferencesBtn;
        return (this._preferencesBtn = val);
      }
    });
    Object.defineProperty(this, "_enableBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._enableBtn;
        return (this._enableBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "enable-btn"
        ));
      },
      set(val) {
        delete this._enableBtn;
        return (this._enableBtn = val);
      }
    });
    Object.defineProperty(this, "_disableBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._disableBtn;
        return (this._disableBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "disable-btn"
        ));
      },
      set(val) {
        delete this._disableBtn;
        return (this._disableBtn = val);
      }
    });
    Object.defineProperty(this, "_removeBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._removeBtn;
        return (this._removeBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "remove-btn"
        ));
      },
      set(val) {
        delete this._removeBtn;
        return (this._removeBtn = val);
      }
    });
    Object.defineProperty(this, "_updateBtn", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._updateBtn;
        return (this._updateBtn = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "update-btn"
        ));
      },
      set(val) {
        delete this._updateBtn;
        return (this._updateBtn = val);
      }
    });
    Object.defineProperty(this, "_controlContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._controlContainer;
        return (this._controlContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "control-container"
        ));
      },
      set(val) {
        delete this._controlContainer;
        return (this._controlContainer = val);
      }
    });
    Object.defineProperty(this, "_installStatus", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._installStatus;
        return (this._installStatus = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "install-status"
        ));
      },
      set(val) {
        delete this._installStatus;
        return (this._installStatus = val);
      }
    });
    Object.defineProperty(this, "_checkingUpdate", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._checkingUpdate;
        return (this._checkingUpdate = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "checking-update"
        ));
      },
      set(val) {
        delete this._checkingUpdate;
        return (this._checkingUpdate = val);
      }
    });
    Object.defineProperty(this, "_updateAvailable", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._updateAvailable;
        return (this._updateAvailable = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "update-available"
        ));
      },
      set(val) {
        delete this._updateAvailable;
        return (this._updateAvailable = val);
      }
    });
    Object.defineProperty(this, "_includeUpdate", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._includeUpdate;
        return (this._includeUpdate = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "include-update"
        ));
      },
      set(val) {
        delete this._includeUpdate;
        return (this._includeUpdate = val);
      }
    });
    Object.defineProperty(this, "_relNotesLoaded", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotesLoaded;
        return (this._relNotesLoaded = false);
      },
      set(val) {
        delete this._relNotesLoaded;
        return (this._relNotesLoaded = val);
      }
    });
    Object.defineProperty(this, "_relNotesToggle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotesToggle;
        return (this._relNotesToggle = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relnotes-toggle-btn"
        ));
      },
      set(val) {
        delete this._relNotesToggle;
        return (this._relNotesToggle = val);
      }
    });
    Object.defineProperty(this, "_relNotesLoading", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotesLoading;
        return (this._relNotesLoading = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relnotes-loading"
        ));
      },
      set(val) {
        delete this._relNotesLoading;
        return (this._relNotesLoading = val);
      }
    });
    Object.defineProperty(this, "_relNotesError", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotesError;
        return (this._relNotesError = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relnotes-error"
        ));
      },
      set(val) {
        delete this._relNotesError;
        return (this._relNotesError = val);
      }
    });
    Object.defineProperty(this, "_relNotesContainer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotesContainer;
        return (this._relNotesContainer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relnotes-container"
        ));
      },
      set(val) {
        delete this._relNotesContainer;
        return (this._relNotesContainer = val);
      }
    });
    Object.defineProperty(this, "_relNotes", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._relNotes;
        return (this._relNotes = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relnotes"
        ));
      },
      set(val) {
        delete this._relNotes;
        return (this._relNotes = val);
      }
    });

    this._installStatus = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "install-status"
    );
    this._installStatus.mControl = this;

    this.setAttribute("contextmenu", "addonitem-popup");

    this._showStatus("none");

    this._initWithAddon(this.mAddon);

    gEventManager.registerAddonListener(this, this.mAddon.id);

    this.addEventListener("click", event => {
      switch (event.detail) {
        case 1:
          // Prevent double-click where the UI changes on the first click
          this._lastClickTarget = event.originalTarget;
          break;
        case 2:
          if (
            event.originalTarget.localName != "button" &&
            !event.originalTarget.classList.contains("text-link") &&
            event.originalTarget == this._lastClickTarget
          ) {
            this.showInDetailView();
          }
          break;
      }
    });
  }
  disconnectedCallback() {
    gEventManager.unregisterAddonListener(this, this.mAddon.id);
  }

  set userDisabled(val) {
    if (val === true) {
      gViewController.commands.cmd_disableItem.doCommand(this.mAddon);
    } else if (val === false) {
      gViewController.commands.cmd_enableItem.doCommand(this.mAddon);
    } else {
      this.mAddon.userDisabled = val;
    }
  }

  get userDisabled() {
    return this.mAddon.userDisabled;
  }

  set includeUpdate(val) {
    // XXXunf Eventually, we'll want to persist this for individual
    //        updates - see bug 594619.
    this._includeUpdate.checked = !!val;
  }

  get includeUpdate() {
    return this._includeUpdate.checked && !!this.mManualUpdate;
  }
  _initWithAddon(aAddon) {
    this.mAddon = aAddon;

    this._installStatus.mAddon = this.mAddon;
    this._updateDates();
    this._updateState();

    this.setAttribute("name", aAddon.name);

    var iconURL = AddonManager.getPreferredIconURL(aAddon, 48, window);
    if (iconURL) this._icon.src = iconURL;
    else this._icon.src = "";

    if (this.mAddon.description)
      this._description.value = this.mAddon.description;
    else this._description.hidden = true;

    let legacyWarning =
      legacyExtensionsEnabled &&
      !this.mAddon.install &&
      isLegacyExtension(this.mAddon);
    this.setAttribute("legacy", legacyWarning);
    document.getAnonymousElementByAttribute(this, "anonid", "legacy").href =
      SUPPORT_URL + "webextensions";

    if (
      !("applyBackgroundUpdates" in this.mAddon) ||
      (this.mAddon.applyBackgroundUpdates == AddonManager.AUTOUPDATE_DISABLE ||
        (this.mAddon.applyBackgroundUpdates ==
          AddonManager.AUTOUPDATE_DEFAULT &&
          !AddonManager.autoUpdateDefault))
    ) {
      AddonManager.getAllInstalls(aInstallsList => {
        // This can return after the binding has been destroyed,
        // so try to detect that and return early
        if (!("onNewInstall" in this)) return;
        for (let install of aInstallsList) {
          if (
            install.existingAddon &&
            install.existingAddon.id == this.mAddon.id &&
            install.state == AddonManager.STATE_AVAILABLE
          ) {
            this.onNewInstall(install);
            this.onIncludeUpdateChanged();
          }
        }
      });
    }
  }
  _showStatus(aType) {
    this._controlContainer.hidden =
      aType != "none" &&
      !(aType == "update-available" && !this.hasAttribute("upgrade"));

    this._installStatus.hidden = aType != "progress";
    if (aType == "progress") this._installStatus.refreshState();
    this._checkingUpdate.hidden = aType != "checking-update";
    this._updateAvailable.hidden = aType != "update-available";
    this._relNotesToggle.hidden = !(this.mManualUpdate
      ? this.mManualUpdate.releaseNotesURI
      : this.mAddon.releaseNotesURI);
  }
  _updateDates() {
    function formatDate(aDate) {
      const dtOptions = { year: "numeric", month: "long", day: "numeric" };
      return aDate.toLocaleDateString(undefined, dtOptions);
    }

    if (this.mAddon.updateDate)
      this._dateUpdated.value = formatDate(this.mAddon.updateDate);
    else this._dateUpdated.value = this._dateUpdated.getAttribute("unknown");
  }
  _updateState() {
    if (this.parentNode.selectedItem == this) gViewController.updateCommands();

    var pending = this.mAddon.pendingOperations;
    if (pending != AddonManager.PENDING_NONE) {
      this.removeAttribute("notification");

      pending = null;
      const PENDING_OPERATIONS = [
        "enable",
        "disable",
        "install",
        "uninstall",
        "upgrade"
      ];
      for (let op of PENDING_OPERATIONS) {
        if (this.isPending(op)) pending = op;
      }

      this.setAttribute("pending", pending);
      this._pending.textContent = gStrings.ext.formatStringFromName(
        "notification." + pending,
        [this.mAddon.name, gStrings.brandShortName],
        2
      );
    } else {
      this.removeAttribute("pending");

      var isUpgrade = this.hasAttribute("upgrade");
      var install = this._installStatus.mInstall;

      if (install && install.state == AddonManager.STATE_DOWNLOAD_FAILED) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.downloadError",
          [this.mAddon.name],
          1
        );
        this._warningBtn.label = gStrings.ext.GetStringFromName(
          "notification.downloadError.retry"
        );
        this._warningBtn.tooltipText = gStrings.ext.GetStringFromName(
          "notification.downloadError.retry.tooltip"
        );
        this._warningBtn.setAttribute(
          "oncommand",
          "document.getBindingParent(this).retryInstall();"
        );
        this._warningBtn.hidden = false;
        this._warningLink.hidden = true;
      } else if (
        install &&
        install.state == AddonManager.STATE_INSTALL_FAILED
      ) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.installError",
          [this.mAddon.name],
          1
        );
        this._warningBtn.label = gStrings.ext.GetStringFromName(
          "notification.installError.retry"
        );
        this._warningBtn.tooltipText = gStrings.ext.GetStringFromName(
          "notification.downloadError.retry.tooltip"
        );
        this._warningBtn.setAttribute(
          "oncommand",
          "document.getBindingParent(this).retryInstall();"
        );
        this._warningBtn.hidden = false;
        this._warningLink.hidden = true;
      } else if (
        !isUpgrade &&
        this.mAddon.blocklistState == Ci.nsIBlocklistService.STATE_BLOCKED
      ) {
        this.setAttribute("notification", "error");
        this._error.textContent = gStrings.ext.formatStringFromName(
          "notification.blocked",
          [this.mAddon.name],
          1
        );
        this._errorLink.value = gStrings.ext.GetStringFromName(
          "notification.blocked.link"
        );
        this._errorLink.href = this.mAddon.blocklistURL;
        this._errorLink.hidden = false;
      } else if (
        !isUpgrade &&
        !isCorrectlySigned(this.mAddon) &&
        AddonSettings.REQUIRE_SIGNING
      ) {
        this.setAttribute("notification", "error");
        this._error.textContent = gStrings.ext.formatStringFromName(
          "notification.unsignedAndDisabled",
          [this.mAddon.name, gStrings.brandShortName],
          2
        );
        this._errorLink.value = gStrings.ext.GetStringFromName(
          "notification.unsigned.link"
        );
        this._errorLink.href = SUPPORT_URL + "unsigned-addons";
        this._errorLink.hidden = false;
      } else if (
        !isUpgrade &&
        !this.mAddon.isCompatible &&
        (AddonManager.checkCompatibility ||
          this.mAddon.blocklistState !=
            Ci.nsIBlocklistService.STATE_SOFTBLOCKED)
      ) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.incompatible",
          [this.mAddon.name, gStrings.brandShortName, gStrings.appVersion],
          3
        );
        this._warningLink.hidden = true;
        this._warningBtn.hidden = true;
      } else if (
        !isUpgrade &&
        this.mAddon.appDisabled &&
        this.mAddon.type == "extension" &&
        !this.mAddon.multiprocessCompatible &&
        !Services.prefs.getBoolPref("extensions.allow-non-mpc-extensions", true)
      ) {
        this.setAttribute("notification", "error");
        this._error.textContent = gStrings.ext.formatStringFromName(
          "notification.nonMpcDisabled",
          [this.mAddon.name],
          1
        );
        this._errorLink.value = gStrings.ext.GetStringFromName(
          "notification.nonMpcDisabled.link"
        );
        this._errorLink.href = "https://wiki.mozilla.org/Add-ons/ShimsNightly";
        this._errorLink.hidden = false;
      } else if (!isUpgrade && !isCorrectlySigned(this.mAddon)) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.unsigned",
          [this.mAddon.name, gStrings.brandShortName],
          2
        );
        this._warningLink.value = gStrings.ext.GetStringFromName(
          "notification.unsigned.link"
        );
        this._warningLink.href = SUPPORT_URL + "unsigned-addons";
        this._warningLink.hidden = false;
      } else if (
        !isUpgrade &&
        this.mAddon.blocklistState == Ci.nsIBlocklistService.STATE_SOFTBLOCKED
      ) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.softblocked",
          [this.mAddon.name],
          1
        );
        this._warningLink.value = gStrings.ext.GetStringFromName(
          "notification.softblocked.link"
        );
        this._warningLink.href = this.mAddon.blocklistURL;
        this._warningLink.hidden = false;
        this._warningBtn.hidden = true;
      } else if (
        !isUpgrade &&
        this.mAddon.blocklistState == Ci.nsIBlocklistService.STATE_OUTDATED
      ) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.outdated",
          [this.mAddon.name],
          1
        );
        this._warningLink.value = gStrings.ext.GetStringFromName(
          "notification.outdated.link"
        );
        this._warningLink.href = this.mAddon.blocklistURL;
        this._warningLink.hidden = false;
        this._warningBtn.hidden = true;
      } else if (
        !isUpgrade &&
        this.mAddon.blocklistState ==
          Ci.nsIBlocklistService.STATE_VULNERABLE_UPDATE_AVAILABLE
      ) {
        this.setAttribute("notification", "error");
        this._error.textContent = gStrings.ext.formatStringFromName(
          "notification.vulnerableUpdatable",
          [this.mAddon.name],
          1
        );
        this._errorLink.value = gStrings.ext.GetStringFromName(
          "notification.vulnerableUpdatable.link"
        );
        this._errorLink.href = this.mAddon.blocklistURL;
        this._errorLink.hidden = false;
      } else if (
        !isUpgrade &&
        this.mAddon.blocklistState ==
          Ci.nsIBlocklistService.STATE_VULNERABLE_NO_UPDATE
      ) {
        this.setAttribute("notification", "error");
        this._error.textContent = gStrings.ext.formatStringFromName(
          "notification.vulnerableNoUpdate",
          [this.mAddon.name],
          1
        );
        this._errorLink.value = gStrings.ext.GetStringFromName(
          "notification.vulnerableNoUpdate.link"
        );
        this._errorLink.href = this.mAddon.blocklistURL;
        this._errorLink.hidden = false;
      } else if (
        this.mAddon.isGMPlugin &&
        !this.mAddon.isInstalled &&
        this.mAddon.isActive
      ) {
        this.setAttribute("notification", "warning");
        this._warning.textContent = gStrings.ext.formatStringFromName(
          "notification.gmpPending",
          [this.mAddon.name],
          1
        );
      } else {
        this.removeAttribute("notification");
      }
    }

    this._preferencesBtn.hidden =
      !this.mAddon.optionsURL ||
      this.mAddon.optionsType == AddonManager.OPTIONS_TYPE_INLINE_INFO;

    if (this.typeHasFlag("SUPPORTS_ASK_TO_ACTIVATE")) {
      this._enableBtn.disabled = true;
      this._disableBtn.disabled = true;
      this._askToActivateMenuitem.disabled = !this.hasPermission(
        "ask_to_activate"
      );
      this._alwaysActivateMenuitem.disabled = !this.hasPermission("enable");
      this._neverActivateMenuitem.disabled = !this.hasPermission("disable");
      if (!this.mAddon.isActive) {
        this._stateMenulist.selectedItem = this._neverActivateMenuitem;
      } else if (
        this.mAddon.userDisabled == AddonManager.STATE_ASK_TO_ACTIVATE
      ) {
        this._stateMenulist.selectedItem = this._askToActivateMenuitem;
      } else {
        this._stateMenulist.selectedItem = this._alwaysActivateMenuitem;
      }
      let hasActivatePermission = [
        "ask_to_activate",
        "enable",
        "disable"
      ].some(perm => this.hasPermission(perm));
      this._stateMenulist.disabled = !hasActivatePermission;
      this._stateMenulist.hidden = false;
      this._stateMenulist.classList.add("no-auto-hide");
    } else {
      this._stateMenulist.hidden = true;

      let enableTooltip = gViewController.commands.cmd_enableItem.getTooltip(
        this.mAddon
      );
      this._enableBtn.setAttribute("tooltiptext", enableTooltip);
      if (this.hasPermission("enable")) {
        this._enableBtn.hidden = false;
      } else {
        this._enableBtn.hidden = true;
      }

      let disableTooltip = gViewController.commands.cmd_disableItem.getTooltip(
        this.mAddon
      );
      this._disableBtn.setAttribute("tooltiptext", disableTooltip);
      if (this.hasPermission("disable")) {
        this._disableBtn.hidden = false;
      } else {
        this._disableBtn.hidden = true;
      }
    }

    let uninstallTooltip = gViewController.commands.cmd_uninstallItem.getTooltip(
      this.mAddon
    );
    this._removeBtn.setAttribute("tooltiptext", uninstallTooltip);
    if (this.hasPermission("uninstall")) {
      this._removeBtn.hidden = false;
    } else {
      this._removeBtn.hidden = true;
    }

    this.setAttribute("active", this.mAddon.isActive);

    var showProgress =
      this.mAddon.purchaseURL ||
      (this.mAddon.install &&
        this.mAddon.install.state != AddonManager.STATE_INSTALLED);
    this._showStatus(showProgress ? "progress" : "none");

    if (this.mAddon.type == "experiment") {
      this.removeAttribute("notification");
      let prefix = "experiment.";
      let active = this.mAddon.isActive;

      if (!showProgress) {
        let stateKey = prefix + "state." + (active ? "active" : "complete");
        this._experimentState.value = gStrings.ext.GetStringFromName(stateKey);

        let now = Date.now();
        let end = this.endDate;
        let days = Math.abs(end - now) / (24 * 60 * 60 * 1000);

        let timeKey = prefix + "time.";
        let timeMessage;

        if (days < 1) {
          timeKey += active ? "endsToday" : "endedToday";
          timeMessage = gStrings.ext.GetStringFromName(timeKey);
        } else {
          timeKey += active ? "daysRemaining" : "daysPassed";
          days = Math.round(days);
          let timeString = gStrings.ext.GetStringFromName(timeKey);
          timeMessage = PluralForm.get(days, timeString).replace("#1", days);
        }

        this._experimentTime.value = timeMessage;
      }
    }
  }
  _fetchReleaseNotes(aURI) {
    if (!aURI || this._relNotesLoaded) {
      sendToggleEvent();
      return;
    }

    var relNotesData = null,
      transformData = null;

    this._relNotesLoaded = true;
    this._relNotesLoading.hidden = false;
    this._relNotesError.hidden = true;

    let sendToggleEvent = () => {
      var event = document.createEvent("Events");
      event.initEvent("RelNotesToggle", true, true);
      this.dispatchEvent(event);
    };

    let showRelNotes = () => {
      if (!relNotesData || !transformData) return;

      this._relNotesLoading.hidden = true;

      var processor = Components.classes[
        "@mozilla.org/document-transformer;1?type=xslt"
      ].createInstance(Components.interfaces.nsIXSLTProcessor);
      processor.flags |=
        Components.interfaces.nsIXSLTProcessorPrivate.DISABLE_ALL_LOADS;

      processor.importStylesheet(transformData);
      var fragment = processor.transformToFragment(relNotesData, document);
      this._relNotes.appendChild(fragment);
      if (this.hasAttribute("show-relnotes")) {
        var container = this._relNotesContainer;
        container.style.height = container.scrollHeight + "px";
      }
      sendToggleEvent();
    };

    let handleError = () => {
      dataReq.abort();
      styleReq.abort();
      this._relNotesLoading.hidden = true;
      this._relNotesError.hidden = false;
      this._relNotesLoaded = false; // allow loading to be re-tried
      sendToggleEvent();
    };

    function handleResponse(aEvent) {
      var req = aEvent.target;
      var ct = req.getResponseHeader("content-type");
      if (
        (!ct || ct.indexOf("text/html") < 0) &&
        req.responseXML &&
        req.responseXML.documentElement.namespaceURI != XMLURI_PARSE_ERROR
      ) {
        if (req == dataReq) relNotesData = req.responseXML;
        else transformData = req.responseXML;
        showRelNotes();
      } else {
        handleError();
      }
    }

    var dataReq = Components.classes[
      "@mozilla.org/xmlextras/xmlhttprequest;1"
    ].createInstance(Components.interfaces.nsIXMLHttpRequest);
    dataReq.open("GET", aURI.spec, true);
    dataReq.responseType = "document";
    dataReq.addEventListener("load", handleResponse);
    dataReq.addEventListener("error", handleError);
    dataReq.send(null);

    var styleReq = Components.classes[
      "@mozilla.org/xmlextras/xmlhttprequest;1"
    ].createInstance(Components.interfaces.nsIXMLHttpRequest);
    styleReq.open("GET", UPDATES_RELEASENOTES_TRANSFORMFILE, true);
    styleReq.responseType = "document";
    styleReq.addEventListener("load", handleResponse);
    styleReq.addEventListener("error", handleError);
    styleReq.send(null);
  }
  toggleReleaseNotes() {
    if (this.hasAttribute("show-relnotes")) {
      this._relNotesContainer.style.height = "0px";
      this.removeAttribute("show-relnotes");
      this._relNotesToggle.setAttribute(
        "label",
        this._relNotesToggle.getAttribute("showlabel")
      );
      this._relNotesToggle.setAttribute(
        "tooltiptext",
        this._relNotesToggle.getAttribute("showtooltip")
      );
      var event = document.createEvent("Events");
      event.initEvent("RelNotesToggle", true, true);
      this.dispatchEvent(event);
    } else {
      this._relNotesContainer.style.height =
        this._relNotesContainer.scrollHeight + "px";
      this.setAttribute("show-relnotes", true);
      this._relNotesToggle.setAttribute(
        "label",
        this._relNotesToggle.getAttribute("hidelabel")
      );
      this._relNotesToggle.setAttribute(
        "tooltiptext",
        this._relNotesToggle.getAttribute("hidetooltip")
      );
      var uri = this.mManualUpdate
        ? this.mManualUpdate.releaseNotesURI
        : this.mAddon.releaseNotesURI;
      this._fetchReleaseNotes(uri);
    }
  }
  restart() {
    gViewController.commands.cmd_restartApp.doCommand();
  }
  undo() {
    gViewController.commands.cmd_cancelOperation.doCommand(this.mAddon);
  }
  uninstall() {
    // If uninstalling does not require a restart and the type doesn't
    // support undoing of restartless uninstalls, then we fake it by
    // just disabling it it, and doing the real uninstall later.
    if (
      !this.opRequiresRestart("uninstall") &&
      !this.typeHasFlag("SUPPORTS_UNDO_RESTARTLESS_UNINSTALL")
    ) {
      this.setAttribute("wasDisabled", this.mAddon.userDisabled);

      // We must set userDisabled to true first, this will call
      // _updateState which will clear any pending attribute set.
      this.mAddon.userDisabled = true;

      // This won't update any other add-on manager views (bug 582002)
      this.setAttribute("pending", "uninstall");
    } else {
      this.mAddon.uninstall(true);
    }
  }
  showPreferences() {
    gViewController.doCommand("cmd_showItemPreferences", this.mAddon);
  }
  upgrade() {
    var install = this.mManualUpdate;
    delete this.mManualUpdate;
    install.install();
  }
  retryInstall() {
    var install = this._installStatus.mInstall;
    if (!install) return;
    if (
      install.state != AddonManager.STATE_DOWNLOAD_FAILED &&
      install.state != AddonManager.STATE_INSTALL_FAILED
    )
      return;
    install.install();
  }
  showInDetailView() {
    gViewController.loadView(
      "addons://detail/" + encodeURIComponent(this.mAddon.id)
    );
  }
  findReplacement() {
    let url = this.mAddon.type == "theme"
      ? SUPPORT_URL + "complete-themes"
      : `https://addons.mozilla.org/find-replacement/?guid=${this.mAddon.id}`;
    openURL(url);
  }
  onIncludeUpdateChanged() {
    var event = document.createEvent("Events");
    event.initEvent("IncludeUpdateChanged", true, true);
    this.dispatchEvent(event);
  }
  onEnabling() {
    this._updateState();
  }
  onEnabled() {
    this._updateState();
  }
  onDisabling() {
    this._updateState();
  }
  onDisabled() {
    this._updateState();
  }
  onUninstalling(aRestartRequired) {
    this._updateState();
  }
  onOperationCancelled() {
    this._updateState();
  }
  onPropertyChanged(aProperties) {
    if (
      aProperties.indexOf("appDisabled") != -1 ||
      aProperties.indexOf("signedState") != -1 ||
      aProperties.indexOf("userDisabled") != -1
    )
      this._updateState();
  }
  onNoUpdateAvailable() {
    this._showStatus("none");
  }
  onCheckingUpdate() {
    this._showStatus("checking-update");
  }
  onCompatibilityUpdateAvailable() {
    this._updateState();
  }
  onExternalInstall(aAddon, aExistingAddon, aNeedsRestart) {
    if (aExistingAddon.id != this.mAddon.id) return;

    // If the install completed without needing a restart then switch to
    // using the new Addon
    if (!aNeedsRestart) this._initWithAddon(aAddon);
    else this._updateState();
  }
  onNewInstall(aInstall) {
    if (this.mAddon.applyBackgroundUpdates == AddonManager.AUTOUPDATE_ENABLE)
      return;
    if (
      this.mAddon.applyBackgroundUpdates == AddonManager.AUTOUPDATE_DEFAULT &&
      AddonManager.autoUpdateDefault
    )
      return;

    this.mManualUpdate = aInstall;
    this._showStatus("update-available");
  }
  onDownloadStarted(aInstall) {
    this._updateState();
    this._showStatus("progress");
    this._installStatus.initWithInstall(aInstall);
  }
  onInstallStarted(aInstall) {
    this._updateState();
    this._showStatus("progress");
    this._installStatus.initWithInstall(aInstall);
  }
  onInstallEnded(aInstall, aAddon) {
    // If the install completed without needing a restart then switch to
    // using the new Addon
    if (!(aAddon.pendingOperations & AddonManager.PENDING_INSTALL))
      this._initWithAddon(aAddon);
    else this._updateState();
  }
  onDownloadFailed() {
    this._updateState();
  }
  onInstallFailed() {
    this._updateState();
  }
  onInstallCancelled() {
    this._updateState();
  }
}
customElements.define("firefox-addon-generic", FirefoxAddonGeneric);
