class FirefoxTabbrowserNewtabPopup extends FirefoxPopup {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("popupshowing", (event) => {
      createUserContextMenu(event, {
        useAccessKeys: false,
        showDefaultTab: Services.prefs.getIntPref("privacy.userContext.longPressBehavior") == 1
      });
    });

  }
}