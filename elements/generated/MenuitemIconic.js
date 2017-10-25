class FirefoxMenuitemIconic extends FirefoxMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,_moz-menuactive,disabled,checked">
        <xul:image class="menu-iconic-icon" inherits="src=image,triggeringprincipal=iconloadingprincipal,validate,src"></xul:image>
      </xul:hbox>
      <xul:label class="menu-iconic-text" flex="1" inherits="value=label,accesskey,crop,highlightable" crop="right"></xul:label>
      <xul:label class="menu-iconic-highlightable-text" inherits="text=label,crop,accesskey,highlightable" crop="right"></xul:label>
      <children></children>
      <xul:hbox class="menu-accel-container" anonid="accel">
        <xul:label class="menu-iconic-accel" inherits="value=acceltext"></xul:label>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-menuitem-iconic", FirefoxMenuitemIconic);
