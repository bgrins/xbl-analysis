class TabbrowserRemoteBrowser extends RemoteBrowser {
  connectedCallback() {
    super.connectedCallback()

    this.tabModalPromptBox = null;

    this._setupEventListeners();
  }

  /**
   * throws exception for unknown schemes
   */
  loadURI(aURI, aParams) {
    _loadURI(this, aURI, aParams);
  }

  _setupEventListeners() {

  }
}