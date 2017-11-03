class FirefoxSettingControl extends FirefoxSettingBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:vbox>
        <xul:hbox class="preferences-alignment">
          <xul:label class="preferences-title" flex="1" inherits="text=title"></xul:label>
        </xul:hbox>
        <xul:description class="preferences-description" flex="1" inherits="text=desc"></xul:description>
      </xul:vbox>
      <xul:hbox class="preferences-alignment">
        <children></children>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-setting-control", FirefoxSettingControl);
