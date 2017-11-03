class FirefoxUpdateheader extends FirefoxWizardHeader {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="wizard-header update-header" flex="1">
        <xul:vbox class="wizard-header-box-1">
          <xul:vbox class="wizard-header-box-text">
            <xul:label class="wizard-header-label" inherits="value=label"></xul:label>
          </xul:vbox>
        </xul:vbox>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-updateheader", FirefoxUpdateheader);
