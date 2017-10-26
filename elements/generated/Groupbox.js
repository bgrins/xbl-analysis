class FirefoxGroupbox extends FirefoxGroupboxBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="groupbox-title" align="center" pack="start">
        <children includes="caption"></children>
      </xul:hbox>
      <xul:box flex="1" class="groupbox-body" inherits="orient,align,pack">
        <children></children>
      </xul:box>
    `;
  }
}
customElements.define("firefox-groupbox", FirefoxGroupbox);
