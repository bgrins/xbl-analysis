class FirefoxMenuMenubar extends FirefoxMenuBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:label class="menubar-text" inherits="value=label,accesskey,crop" crop="right"></xul:label>
      <children includes="menupopup"></children>
    `;
  }
}
customElements.define("firefox-menu-menubar", FirefoxMenuMenubar);
