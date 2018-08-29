class MozUpdateheader extends MozWizardHeader {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="wizard-header update-header" flex="1">
        <vbox class="wizard-header-box-1">
          <vbox class="wizard-header-box-text">
            <label class="wizard-header-label" inherits="value=label"></label>
          </vbox>
        </vbox>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}