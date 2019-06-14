/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAddonUninstalled extends MozAddonBase {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="pending">
        <image class="pending-icon"></image>
        <label anonid="notice" flex="1"></label>
        <button anonid="undo-btn" class="button-link" label="FROM-DTD.addon.undoRemove.label;" tooltiptext="FROM-DTD.addon.undoRemove.tooltip;" oncommand="document.getBindingParent(this).cancelUninstall();"></button>
        <spacer flex="5000"></spacer>
      </hbox>
    `));

    this._notice = document.getAnonymousElementByAttribute(this, "anonid", "notice");

    this._notice.textContent = gStrings.ext.formatStringFromName("uninstallNotice",
      [this.mAddon.name]);

    gEventManager.registerAddonListener(this, this.mAddon.id);

  }

  cancelUninstall() {
    // This assumes that disabling does not require a restart when
    // uninstalling doesn't. Things will still work if not, the add-on
    // will just still be active until finally getting uninstalled.

    if (this.isPending("uninstall"))
      this.mAddon.cancelUninstall();
    else if (this.getAttribute("wasDisabled") != "true")
      this.mAddon.enable();

    // Dispatch an event so extensions.js can record telemetry.
    var event = document.createEvent("Events");
    event.initEvent("Undo", true, true);
    this.dispatchEvent(event);

    this.removeAttribute("pending");
  }

  onExternalInstall(aAddon, aExistingAddon) {
    if (aExistingAddon.id != this.mAddon.id)
      return;

    // Make sure any newly installed add-on has the correct disabled state
    if (this.hasAttribute("wasDisabled")) {
      if (this.getAttribute("wasDisabled") == "true")
        aAddon.disable();
      else
        aAddon.enable();
    }

    this.mAddon = aAddon;

    this.removeAttribute("pending");
  }

  onInstallStarted(aInstall) {
    // Make sure any newly installed add-on has the correct disabled state
    if (this.hasAttribute("wasDisabled")) {
      if (this.getAttribute("wasDisabled") == "true")
        aInstall.addon.disable();
      else
        aInstall.addon.enable();
    }
  }

  onInstallEnded(aInstall, aAddon) {
    this.mAddon = aAddon;

    this.removeAttribute("pending");
  }
  disconnectedCallback() {
    gEventManager.unregisterAddonListener(this, this.mAddon.id);
  }
}

customElements.define("addon-uninstalled", MozAddonUninstalled);

}
