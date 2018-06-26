class WizardHeader extends WizardBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="wizard-header-box-1" flex="1">
        <vbox class="wizard-header-box-text" flex="1">
          <label class="wizard-header-label" inherits="text=label"></label>
          <label class="wizard-header-description" inherits="text=description"></label>
        </vbox>
        <image class="wizard-header-icon" inherits="src=iconsrc"></image>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}