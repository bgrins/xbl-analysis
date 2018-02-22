class FirefoxListcell extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children>
        <xul:label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right"></xul:label>
      </children>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}