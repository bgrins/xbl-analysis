class FirefoxAddonBase extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback()

    this.setupHandlers();
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
  opRequiresRestart(aOperation) {
    var operation = AddonManager["OP_NEEDS_RESTART_" + aOperation.toUpperCase()];
    return !!(this.mAddon.operationsRequiringRestart & operation);
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

  setupHandlers() {

  }
}