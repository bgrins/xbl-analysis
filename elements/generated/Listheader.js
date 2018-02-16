class FirefoxListheader extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:image class="listheader-icon"></xul:image>
      <xul:label class="listheader-label" inherits="value=label,crop" flex="1" crop="right"></xul:label>
      <xul:image class="listheader-sortdirection" inherits="sortDirection"></xul:image>
    `;

    this.setupHandlers();
  }

  setupHandlers() {

  }
}