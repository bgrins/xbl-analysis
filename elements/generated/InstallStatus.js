class FirefoxInstallStatus extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:label anonid="message"></xul:label>
      <xul:progressmeter anonid="progress" class="download-progress"></xul:progressmeter>
      <xul:button anonid="purchase-remote-btn" hidden="true" class="addon-control" oncommand="document.getBindingParent(this).purchaseRemote();"></xul:button>
      <xul:button anonid="install-remote-btn" hidden="true" class="addon-control install" label="FROM-DTD-addon-install-label" tooltiptext="FROM-DTD-addon-install-tooltip" oncommand="document.getBindingParent(this).installRemote();"></xul:button>
    `;
    Object.defineProperty(this, "_message", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._message;
        return (this._message = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "message"
        ));
      },
      set(val) {
        delete this._message;
        return (this._message = val);
      }
    });
    Object.defineProperty(this, "_progress", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._progress;
        return (this._progress = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "progress"
        ));
      },
      set(val) {
        delete this._progress;
        return (this._progress = val);
      }
    });
    Object.defineProperty(this, "_purchaseRemote", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._purchaseRemote;
        return (this._purchaseRemote = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "purchase-remote-btn"
        ));
      },
      set(val) {
        delete this._purchaseRemote;
        return (this._purchaseRemote = val);
      }
    });
    Object.defineProperty(this, "_installRemote", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._installRemote;
        return (this._installRemote = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "install-remote-btn"
        ));
      },
      set(val) {
        delete this._installRemote;
        return (this._installRemote = val);
      }
    });
    Object.defineProperty(this, "_restartNeeded", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._restartNeeded;
        return (this._restartNeeded = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "restart-needed"
        ));
      },
      set(val) {
        delete this._restartNeeded;
        return (this._restartNeeded = val);
      }
    });
    Object.defineProperty(this, "_undo", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._undo;
        return (this._undo = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "undo-btn"
        ));
      },
      set(val) {
        delete this._undo;
        return (this._undo = val);
      }
    });

    if (this.mInstall) this.initWithInstall(this.mInstall);
    else if (this.mControl.mAddon.install)
      this.initWithInstall(this.mControl.mAddon.install);
    else this.refreshState();
  }
  disconnectedCallback() {
    if (this.mInstall) this.mInstall.removeListener(this);
  }
  initWithInstall(aInstall) {
    if (this.mInstall) {
      this.mInstall.removeListener(this);
      this.mInstall = null;
    }
    this.mInstall = aInstall;
    this._progress.mInstall = aInstall;
    this.refreshState();
    this.mInstall.addListener(this);
  }
  refreshState() {
    var showInstallRemote = false;
    var showPurchase = false;

    if (this.mInstall) {
      switch (this.mInstall.state) {
        case AddonManager.STATE_AVAILABLE:
          if (this.mControl.getAttribute("remote") != "true") break;

          this._progress.hidden = true;
          showInstallRemote = true;
          break;
        case AddonManager.STATE_DOWNLOADING:
          this.showMessage("installDownloading");
          break;
        case AddonManager.STATE_CHECKING:
          this.showMessage("installVerifying");
          break;
        case AddonManager.STATE_DOWNLOADED:
          this.showMessage("installDownloaded");
          break;
        case AddonManager.STATE_DOWNLOAD_FAILED:
          // XXXunf expose what error occured (bug 553487)
          this.showMessage("installDownloadFailed", true);
          break;
        case AddonManager.STATE_INSTALLING:
          this.showMessage("installInstalling");
          break;
        case AddonManager.STATE_INSTALL_FAILED:
          // XXXunf expose what error occured (bug 553487)
          this.showMessage("installFailed", true);
          break;
        case AddonManager.STATE_CANCELLED:
          this.showMessage("installCancelled", true);
          break;
      }
    } else if (this.mControl.mAddon.purchaseURL) {
      this._progress.hidden = true;
      showPurchase = true;
      this._purchaseRemote.label = gStrings.ext.formatStringFromName(
        "addon.purchase.label",
        [this.mControl.mAddon.purchaseDisplayAmount],
        1
      );
      this._purchaseRemote.tooltiptext = gStrings.ext.GetStringFromName(
        "addon.purchase.tooltip"
      );
    }

    this._purchaseRemote.hidden = !showPurchase;
    this._installRemote.hidden = !showInstallRemote;

    if ("refreshInfo" in this.mControl) this.mControl.refreshInfo();
  }
  showMessage(aMsgId, aHideProgress) {
    this._message.setAttribute("hidden", !aHideProgress);
    this._progress.setAttribute("hidden", !!aHideProgress);

    var msg = gStrings.ext.GetStringFromName(aMsgId);
    if (aHideProgress) this._message.value = msg;
    else this._progress.status = msg;
  }
  purchaseRemote() {
    openURL(this.mControl.mAddon.purchaseURL);
  }
  installRemote() {
    if (this.mControl.getAttribute("remote") != "true") return;

    if (this.mControl.mAddon.eula) {
      var data = {
        addon: this.mControl.mAddon,
        accepted: false
      };
      window.openDialog(
        "chrome://mozapps/content/extensions/eula.xul",
        "_blank",
        "chrome,dialog,modal,centerscreen,resizable=no",
        data
      );
      if (!data.accepted) return;
    }

    delete this.mControl.mAddon;
    this.mControl.mInstall = this.mInstall;
    this.mControl.setAttribute("status", "installing");
    let prompt = Services.prefs.getBoolPref(
      "extensions.webextPermissionPrompts",
      false
    );
    if (prompt) {
      this.mInstall.promptHandler = info =>
        new Promise((resolve, reject) => {
          // Skip prompts for non-webextensions
          if (!info.addon.userPermissions) {
            resolve();
            return;
          }
          let subject = {
            wrappedJSObject: {
              target: window
                .QueryInterface(Ci.nsIInterfaceRequestor)
                .getInterface(Ci.nsIDocShell).chromeEventHandler,
              info: {
                addon: info.addon,
                source: "AMO",
                icon: info.addon.iconURL,
                permissions: info.addon.userPermissions,
                resolve,
                reject
              }
            }
          };
          Services.obs.notifyObservers(
            subject,
            "webextension-permission-prompt"
          );
        });
    }
    this.mInstall.install();
  }
  undoAction() {
    if (!this.mAddon) return;
    var pending = this.mAddon.pendingOperations;
    if (pending & AddonManager.PENDING_ENABLE) this.mAddon.userDisabled = true;
    else if (pending & AddonManager.PENDING_DISABLE)
      this.mAddon.userDisabled = false;
    this.refreshState();
  }
  onDownloadStarted() {
    this.refreshState();
  }
  onDownloadEnded() {
    this.refreshState();
  }
  onDownloadFailed() {
    this.refreshState();
  }
  onDownloadProgress() {
    this._progress.maxProgress = this.mInstall.maxProgress;
    this._progress.progress = this.mInstall.progress;
  }
  onInstallStarted() {
    this._progress.progress = 0;
    this.refreshState();
  }
  onInstallEnded() {
    this.refreshState();
    if ("onInstallCompleted" in this.mControl)
      this.mControl.onInstallCompleted();
  }
  onInstallFailed() {
    this.refreshState();
  }
}
customElements.define("firefox-install-status", FirefoxInstallStatus);
