class FirefoxSettingColor extends FirefoxSettingBase {
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
        <xul:colorpicker type="button" anonid="input" inherits="disabled" onchange="document.getBindingParent(this).inputChanged();"></xul:colorpicker>
      </xul:hbox>
    `;
  }

  set value(val) {
    return (this.input.color = val);
  }

  get value() {
    return this.input.color;
  }
  valueFromPreference() {
    // We must wait for the colorpicker's binding to be applied before setting the value
    if (!this.input.color) this.input.initialize();
    this.value = Services.prefs.getCharPref(this.pref);
  }
  valueToPreference() {
    Services.prefs.setCharPref(this.pref, this.value);
  }
}
customElements.define("firefox-setting-color", FirefoxSettingColor);
