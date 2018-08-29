/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozInstallStatus extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <label anonid="message"></label>
      <box anonid="progress" class="download-progress"></box>
      <button anonid="install-remote-btn" hidden="true" class="addon-control install" label="FROM-DTD.addon.install.label;" tooltiptext="FROM-DTD.addon.install.tooltip;" oncommand="document.getBindingParent(this).installRemote();"></button>
    `));
    this._message = document.getAnonymousElementByAttribute(this, "anonid", "message");

    this._progress = document.getAnonymousElementByAttribute(this, "anonid", "progress");

    this._installRemote = document.getAnonymousElementByAttribute(this, "anonid",
      "install-remote-btn");

    this._undo = document.getAnonymousElementByAttribute(this, "anonid",
      "undo-btn");

    if (this.mInstall)
      this.initWithInstall(this.mInstall);
    else if (this.mControl.mAddon.install)
      this.initWithInstall(this.mControl.mAddon.install);
    else
      this.refreshState();

    this._setupEventListeners();
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

    if (this.mInstall) {

      switch (this.mInstall.state) {
        case AddonManager.STATE_AVAILABLE:
          if (this.mControl.getAttribute("remote") != "true")
            break;

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

    }

    this._installRemote.hidden = !showInstallRemote;

    if ("refreshInfo" in this.mControl)
      this.mControl.refreshInfo();
  }

  showMessage(aMsgId, aHideProgress) {
    this._message.setAttribute("hidden", !aHideProgress);
    this._progress.setAttribute("hidden", !!aHideProgress);

    var msg = gStrings.ext.GetStringFromName(aMsgId);
    if (aHideProgress)
      this._message.value = msg;
    else
      this._progress.status = msg;
  }

  installRemote() {
    if (this.mControl.getAttribute("remote") != "true")
      return;

    if (this.mControl.mAddon.eula) {
      var data = {
        addon: this.mControl.mAddon,
        accepted: false
      };
      window.openDialog("chrome://mozapps/content/extensions/eula.xul", "_blank",
        "chrome,dialog,modal,centerscreen,resizable=no", data);
      if (!data.accepted)
        return;
    }

    delete this.mControl.mAddon;
    this.mControl.mInstall = this.mInstall;
    this.mControl.setAttribute("status", "installing");
    let prompt = Services.prefs.getBoolPref("extensions.webextPermissionPrompts", false);
    if (prompt) {
      this.mInstall.promptHandler = info => new Promise((resolve, reject) => {
        // Skip prompts for non-webextensions
        if (!info.addon.userPermissions) {
          resolve();
          return;
        }
        let subject = {
          wrappedJSObject: {
            target: window.docShell.chromeEventHandler,
            info: {
              addon: info.addon,
              source: "AMO",
              icon: info.addon.iconURL,
              permissions: info.addon.userPermissions,
              resolve,
              reject,
            },
          },
        };
        Services.obs.notifyObservers(subject, "webextension-permission-prompt");
      });
    }
    this.mInstall.install();
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

  disconnectedCallback() {
    if (this.mInstall)
      this.mInstall.removeListener(this);
  }

  _setupEventListeners() {

  }
}

customElements.define("install-status", MozInstallStatus);

}
