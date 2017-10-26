class FirefoxAddengineIcon extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:image class="addengine-icon" inherits="src"></xul:image>
      <xul:image class="addengine-badge"></xul:image>
    `;
  }
}
customElements.define("firefox-addengine-icon", FirefoxAddengineIcon);
