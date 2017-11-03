class FirefoxSettingLocalizedBool extends FirefoxSettingBool {
  connectedCallback() {
    super.connectedCallback();
  }

  valueFromPreference() {
    let val = Services.prefs.getComplexValue(
      this.pref,
      Components.interfaces.nsIPrefLocalizedString
    ).data;
    if (this.inverted) val = !val;
    this.value = val == "true";
  }
  valueToPreference() {
    let val = this.value;
    if (this.inverted) val = !val;
    let pref = Components.classes[
      "@mozilla.org/pref-localizedstring;1"
    ].createInstance(Components.interfaces.nsIPrefLocalizedString);
    pref.data = this.inverted ? (!val).toString() : val.toString();
    Services.prefs.setComplexValue(
      this.pref,
      Components.interfaces.nsIPrefLocalizedString,
      pref
    );
  }
}
customElements.define(
  "firefox-setting-localized-bool",
  FirefoxSettingLocalizedBool
);
