class FirefoxSettingBool extends FirefoxSettingBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:vbox>
        <xul:hbox class="preferences-alignment">
          <xul:label class="preferences-title" flex="1" inherits="text=title"></xul:label>
        </xul:hbox>
        <xul:description class="preferences-description" flex="1" inherits="text=desc"></xul:description>
        <xul:label class="preferences-learnmore text-link" onclick="document.getBindingParent(this).openLearnMore()"></xul:label>
      </xul:vbox>
      <xul:hbox class="preferences-alignment">
        <xul:checkbox anonid="input" inherits="disabled,onlabel,offlabel,label=checkboxlabel" oncommand="inputChanged();"></xul:checkbox>
      </xul:hbox>
    `;
  }

  set value(val) {
    return this.input.setChecked(val);
  }

  get value() {
    return this.input.checked;
  }

  get inverted() {
    return this.getAttribute("inverted");
  }
  valueFromPreference() {
    let val = Services.prefs.getBoolPref(this.pref);
    this.value = this.inverted ? !val : val;
  }
  valueToPreference() {
    let val = this.value;
    Services.prefs.setBoolPref(this.pref, this.inverted ? !val : val);
  }
  openLearnMore() {
    window.open(this.getAttribute("learnmore"), "_blank");
  }
}
customElements.define("firefox-setting-bool", FirefoxSettingBool);
