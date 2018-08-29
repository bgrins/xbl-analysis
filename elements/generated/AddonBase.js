/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAddonBase extends MozRichlistitem {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  get isLegacy() {
    if (this.mAddon.install) {
      return false;
    }
    return isLegacyExtension(this.mAddon);
  }

  hasPermission(aPerm) {
    var perm = AddonManager["PERM_CAN_" + aPerm.toUpperCase()];
    return !!(this.mAddon.permissions & perm);
  }

  isPending(aAction) {
    var action = AddonManager["PENDING_" + aAction.toUpperCase()];
    return !!(this.mAddon.pendingOperations & action);
  }

  typeHasFlag(aFlag) {
    let flag = AddonManager["TYPE_" + aFlag];
    let type = AddonManager.addonTypes[this.mAddon.type];

    return !!(type.flags & flag);
  }

  onUninstalled() {
    this.remove();
  }

  _setupEventListeners() {

  }
}

customElements.define("addon-base", MozAddonBase);

}
