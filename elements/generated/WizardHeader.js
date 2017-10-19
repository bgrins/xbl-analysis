class FirefoxWizardHeader extends FirefoxWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="wizard-header-box-1" flex="1">
<xul:vbox class="wizard-header-box-text" flex="1">
<xul:label class="wizard-header-label" inherits="text=label">
</xul:label>
<xul:label class="wizard-header-description" inherits="text=description">
</xul:label>
</xul:vbox>
<xul:image class="wizard-header-icon" inherits="src=iconsrc">
</xul:image>
</xul:hbox>`;
    let comment = document.createComment("Creating firefox-wizard-header");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-wizard-header", FirefoxWizardHeader);
