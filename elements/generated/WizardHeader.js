class FirefoxWizardHeader extends FirefoxWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="wizard-header-box-1" flex="1">
<vbox class="wizard-header-box-text" flex="1">
<firefox-text-label class="wizard-header-label" inherits="text=label">
</firefox-text-label>
<firefox-text-label class="wizard-header-description" inherits="text=description">
</firefox-text-label>
</vbox>
<image class="wizard-header-icon" inherits="src=iconsrc">
</image>
</hbox>`;
    let comment = document.createComment("Creating firefox-wizard-header");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-wizard-header", FirefoxWizardHeader);
