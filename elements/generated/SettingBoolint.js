class FirefoxSettingBoolint extends FirefoxSettingBool {
  connectedCallback() {
    super.connectedCallback();
  }

  valueFromPreference() {
    let val = Services.prefs.getIntPref(this.pref);
    this.value = val == this.getAttribute("on");
  }
  valueToPreference() {
    Services.prefs.setIntPref(
      this.pref,
      this.getAttribute(this.value ? "on" : "off")
    );
  }
}
customElements.define("firefox-setting-boolint", FirefoxSettingBoolint);
