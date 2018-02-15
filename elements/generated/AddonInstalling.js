class FirefoxAddonInstalling extends FirefoxAddonBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox anonid="warning-container" class="warning">
        <xul:image class="warning-icon"></xul:image>
        <xul:label anonid="warning" flex="1"></xul:label>
        <xul:button anonid="warning-link" class="button-link" oncommand="document.getBindingParent(this).retryInstall();"></xul:button>
        <xul:spacer flex="5000"></xul:spacer>
      </xul:hbox>
      <xul:hbox class="content-container">
        <xul:vbox class="icon-outer-container">
          <xul:vbox class="icon-container">
            <xul:image anonid="icon" class="icon"></xul:image>
          </xul:vbox>
        </xul:vbox>
        <xul:vbox class="fade name-outer-container" flex="1">
          <xul:hbox class="name-container">
            <xul:label anonid="name" class="name" crop="end" tooltip="addonitem-tooltip"></xul:label>
          </xul:hbox>
        </xul:vbox>
        <xul:vbox class="install-status-container">
          <xul:hbox anonid="install-status" class="install-status"></xul:hbox>
        </xul:vbox>
      </xul:hbox>
    `;

    this._icon = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "icon"
    );

    this._name = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "name"
    );

    this._warning = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "warning"
    );

    this._warningLink = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "warning-link"
    );

    this._installStatus = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "install-status"
    );

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
      this._icon.src =
        this.mAddon.iconURL || (this.mInstall ? this.mInstall.iconURL : "");
      this._name.value = this.mAddon.name;
    } else {
      this._icon.src = this.mInstall.iconURL;
      // AddonInstall.name isn't always available - fallback to filename
      if (this.mInstall.name) {
        this._name.value = this.mInstall.name;
      } else if (this.mInstall.sourceURI) {
        var url = Components.classes[
          "@mozilla.org/network/standard-url-mutator;1"
        ]
          .createInstance(Components.interfaces.nsIStandardURLMutator)
          .init(
            Components.interfaces.nsIStandardURL.URLTYPE_STANDARD,
            80,
            this.mInstall.sourceURI.spec,
            null,
            null
          )
          .finalize()
          .QueryInterface(Components.interfaces.nsIURL);
        this._name.value = url.fileName;
      }
    }

    if (this.mInstall.state == AddonManager.STATE_DOWNLOAD_FAILED) {
      this.setAttribute("notification", "warning");
      this._warning.textContent = gStrings.ext.formatStringFromName(
        "notification.downloadError",
        [this._name.value],
        1
      );
      this._warningLink.label = gStrings.ext.GetStringFromName(
        "notification.downloadError.retry"
      );
      this._warningLink.tooltipText = gStrings.ext.GetStringFromName(
        "notification.downloadError.retry.tooltip"
      );
    } else if (this.mInstall.state == AddonManager.STATE_INSTALL_FAILED) {
      this.setAttribute("notification", "warning");
      this._warning.textContent = gStrings.ext.formatStringFromName(
        "notification.installError",
        [this._name.value],
        1
      );
      this._warningLink.label = gStrings.ext.GetStringFromName(
        "notification.installError.retry"
      );
      this._warningLink.tooltipText = gStrings.ext.GetStringFromName(
        "notification.downloadError.retry.tooltip"
      );
    } else {
      this.removeAttribute("notification");
    }
  }
  retryInstall() {
    this.mInstall.install();
  }
}
customElements.define("firefox-addon-installing", FirefoxAddonInstalling);
