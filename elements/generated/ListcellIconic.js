class FirefoxListcellIconic extends FirefoxListcell {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children>
        <xul:image class="listcell-icon" inherits="src=image"></xul:image>
        <xul:label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right"></xul:label>
      </children>
    `;

    this.setupHandlers();
  }

  setupHandlers() {

  }
}