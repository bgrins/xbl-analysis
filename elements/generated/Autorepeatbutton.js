class FirefoxAutorepeatbutton extends FirefoxScrollboxBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:image class="autorepeatbutton-icon"></xul:image>
    `;
  }
}
customElements.define("firefox-autorepeatbutton", FirefoxAutorepeatbutton);
