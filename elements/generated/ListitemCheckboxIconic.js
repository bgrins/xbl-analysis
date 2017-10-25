class FirefoxListitemCheckboxIconic extends FirefoxListitemCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children>
<xul:listcell type="checkbox" class="listcell-iconic" inherits="label,image,crop,checked,disabled,flexlabel">
</xul:listcell>
</children>`;
  }
}
customElements.define(
  "firefox-listitem-checkbox-iconic",
  FirefoxListitemCheckboxIconic
);
