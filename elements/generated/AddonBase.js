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