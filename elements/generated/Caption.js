class FirefoxCaption extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children>
        <xul:image class="caption-icon" inherits="src=image"></xul:image>
        <xul:label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey"></xul:label>
      </children>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}