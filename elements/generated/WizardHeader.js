class XblWizardHeader extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="wizard-header-box-1" flex="1">
<vbox class="wizard-header-box-text" flex="1">
<xbl-text-label class="wizard-header-label" inherits="text=label">
</xbl-text-label>
<xbl-text-label class="wizard-header-description" inherits="text=description">
</xbl-text-label>
</vbox>
<image class="wizard-header-icon" inherits="src=iconsrc">
</image>
</hbox>`;
    let comment = document.createComment("Creating xbl-wizard-header");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-header", XblWizardHeader);
