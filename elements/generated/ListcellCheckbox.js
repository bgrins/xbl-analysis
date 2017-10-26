class FirefoxListcellCheckbox extends FirefoxListcell {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <children>
        <xul:image class="listcell-check" inherits="checked,disabled"></xul:image>
        <xul:label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right"></xul:label>
      </children>
    `;
  }
}
customElements.define("firefox-listcell-checkbox", FirefoxListcellCheckbox);
