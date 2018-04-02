class FirefoxAddonUninstalled extends FirefoxAddonBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="pending">
        <xul:image class="pending-icon"></xul:image>
        <xul:label anonid="notice" flex="1"></xul:label>
        <xul:button anonid="undo-btn" class="button-link" label="FROM-DTD-addon-undoRemove-label" tooltiptext="FROM-DTD-addon-undoRemove-tooltip" oncommand="document.getBindingParent(this).cancelUninstall();"></xul:button>
        <xul:spacer flex="5000"></xul:spacer>
      </xul:hbox>
    `;
    this._notice = document.getAnonymousElementByAttribute(this, "anonid", "notice");

    this._notice.textContent = gStrings.ext.formatStringFromName("uninstallNotice", [this.mAddon.name],
      1);

    gEventManager.registerAddonListener(this, this.mAddon.id);

    this._setupEventListeners();
  }

  cancelUninstall() {
    // This assumes that disabling does not require a restart when
    // uninstalling doesn't. Things will still work if not, the add-on
    // will just still be active until finally getting uninstalled.

    if (this.isPending("uninstall"))
      this.mAddon.cancelUninstall();
    else if (this.getAttribute("wasDisabled") != "true")
      this.mAddon.userDisabled = false;

    this.removeAttribute("pending");
  }

  onExternalInstall(aAddon, aExistingAddon) {
    if (aExistingAddon.id != this.mAddon.id)
      return;

    // Make sure any newly installed add-on has the correct disabled state
    if (this.hasAttribute("wasDisabled"))
      aAddon.userDisabled = this.getAttribute("wasDisabled") == "true";

    this.mAddon = aAddon;

    this.removeAttribute("pending");
  }

  onInstallStarted(aInstall) {
    // Make sure any newly installed add-on has the correct disabled state
    if (this.hasAttribute("wasDisabled"))
      aInstall.addon.userDisabled = this.getAttribute("wasDisabled") == "true";
  }

  onInstallEnded(aInstall, aAddon) {
    this.mAddon = aAddon;

    this.removeAttribute("pending");
  }

  disconnectedCallback() {
    gEventManager.unregisterAddonListener(this, this.mAddon.id);
  }

  _setupEventListeners() {

  }
}