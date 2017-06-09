class XblWizardHeader extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="wizard-header-box-1" flex="1">
<vbox class="wizard-header-box-text" flex="1">
<label class="wizard-header-label" xbl:inherits="xbl:text=label">
</label>
<label class="wizard-header-description" xbl:inherits="xbl:text=description">
</label>
</vbox>
<image class="wizard-header-icon" xbl:inherits="src=iconsrc">
</image>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-wizard-header ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-header", XblWizardHeader);
