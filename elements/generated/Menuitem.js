class FirefoxMenuitem extends FirefoxMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:label class="menu-text" inherits="value=label,accesskey,crop,highlightable" crop="right"></xul:label>
      <xul:hbox class="menu-accel-container" anonid="accel">
        <xul:label class="menu-accel" inherits="value=acceltext"></xul:label>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-menuitem", FirefoxMenuitem);
