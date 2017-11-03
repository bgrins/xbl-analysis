class FirefoxSettingInteger extends FirefoxSettingBase {
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
        <xul:textbox type="number" anonid="input" oninput="inputChanged();" onchange="inputChanged();" inherits="disabled,emptytext,min,max,increment,hidespinbuttons,wraparound,size"></xul:textbox>
      </xul:hbox>
    `;
  }

  valueFromPreference() {
    let val = Services.prefs.getIntPref(this.pref);
    this.value = val;
  }
  valueToPreference() {
    Services.prefs.setIntPref(this.pref, this.value);
  }
}
customElements.define("firefox-setting-integer", FirefoxSettingInteger);
