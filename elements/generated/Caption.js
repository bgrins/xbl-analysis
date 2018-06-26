class Caption extends Basetext {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children>
        <image class="caption-icon" inherits="src=image"></image>
        <label class="caption-text" flex="1" inherits="default,value=label,crop,accesskey"></label>
      </children>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}