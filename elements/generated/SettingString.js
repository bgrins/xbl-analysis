class FirefoxSettingString extends FirefoxSettingBase {
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
        <xul:textbox anonid="input" flex="1" oninput="inputChanged();" inherits="disabled,emptytext,type=inputtype,min,max,increment,hidespinbuttons,decimalplaces,wraparound"></xul:textbox>
      </xul:hbox>
    `;
  }

  valueFromPreference() {
    this.value = Preferences.get(this.pref, "");
  }
  valueToPreference() {
    Preferences.set(this.pref, this.value);
  }
}
customElements.define("firefox-setting-string", FirefoxSettingString);
