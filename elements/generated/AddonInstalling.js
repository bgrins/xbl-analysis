/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAddonInstalling extends MozAddonBase {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox anonid="warning-container" class="warning">
        <image class="warning-icon"></image>
        <label anonid="warning" flex="1"></label>
        <button anonid="warning-link" class="button-link" oncommand="document.getBindingParent(this).retryInstall();"></button>
        <spacer flex="5000"></spacer>
      </hbox>
      <hbox class="content-container">
        <vbox class="icon-outer-container">
          <vbox class="icon-container">
            <image anonid="icon" class="icon"></image>
          </vbox>
        </vbox>
        <vbox class="fade name-outer-container" flex="1">
          <hbox class="name-container">
            <label anonid="name" class="name" crop="end" tooltip="addonitem-tooltip"></label>
          </hbox>
        </vbox>
        <vbox class="install-status-container">
          <hbox anonid="install-status" class="install-status"></hbox>
        </vbox>
      </hbox>
    `));

    this._icon = document.getAnonymousElementByAttribute(this, "anonid", "icon");

    this._name = document.getAnonymousElementByAttribute(this, "anonid", "name");

    this._warning = document.getAnonymousElementByAttribute(this, "anonid", "warning");

    this._warningLink = document.getAnonymousElementByAttribute(this, "anonid", "warning-link");

    this._installStatus = document.getAnonymousElementByAttribute(this, "anonid",
      "install-status");

    this._installStatus.mControl = this;
    this._installStatus.mInstall = this.mInstall;
    this.refreshInfo();

  }

  onInstallCompleted() {
    this.mAddon = this.mInstall.addon;
    this.setAttribute("name", this.mAddon.name);
    this.setAttribute("value", this.mAddon.id);
    this.setAttribute("status", "installed");
  }

  refreshInfo() {
    this.mAddon = this.mAddon || this.mInstall.addon;
    if (this.mAddon) {
      this._icon.src = this.mAddon.iconURL ||
        (this.mInstall ? this.mInstall.iconURL : "");
      this._name.value = this.mAddon.name;
    } else {
      this._icon.src = this.mInstall.iconURL;
      // AddonInstall.name isn't always available - fallback to filename
      if (this.mInstall.name) {
        this._name.value = this.mInstall.name;
      } else if (this.mInstall.sourceURI) {
        var url = Cc["@mozilla.org/network/standard-url-mutator;1"]
          .createInstance(Ci.nsIStandardURLMutator)
          .init(Ci.nsIStandardURL.URLTYPE_STANDARD,
            80, this.mInstall.sourceURI.spec,
            null, null)
          .finalize()
          .QueryInterface(Ci.nsIURL);
        this._name.value = url.fileName;
      }
    }

    if (this.mInstall.state == AddonManager.STATE_DOWNLOAD_FAILED) {
      this.setAttribute("notification", "warning");
      this._warning.textContent = gStrings.ext.formatStringFromName(
        "notification.downloadError",
        [this._name.value]
      );
      this._warningLink.label = gStrings.ext.GetStringFromName("notification.downloadError.retry");
      this._warningLink.tooltipText = gStrings.ext.GetStringFromName("notification.downloadError.retry.tooltip");
    } else if (this.mInstall.state == AddonManager.STATE_INSTALL_FAILED) {
      this.setAttribute("notification", "warning");
      this._warning.textContent = gStrings.ext.formatStringFromName(
        "notification.installError",
        [this._name.value]
      );
      this._warningLink.label = gStrings.ext.GetStringFromName("notification.installError.retry");
      this._warningLink.tooltipText = gStrings.ext.GetStringFromName("notification.downloadError.retry.tooltip");
    } else {
      this.removeAttribute("notification");
    }
  }

  retryInstall() {
    this.mInstall.install();
  }
}

customElements.define("addon-installing", MozAddonInstalling);

}
