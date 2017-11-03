class FirefoxSettingMulti extends FirefoxSettingBase {
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
        <children includes="radiogroup|menulist"></children>
      </xul:hbox>
    `;
    Object.defineProperty(this, "control", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.control;
        return (this.control = this.getElementsByTagName(
          this.getAttribute("type") == "radio" ? "radiogroup" : "menulist"
        )[0]);
      },
      set(val) {
        delete this.control;
        return (this.control = val);
      }
    });

    this.control.addEventListener("command", this.inputChanged.bind(this));
  }

  valueFromPreference() {
    let val = Preferences.get(this.pref, "").toString();

    if ("itemCount" in this.control) {
      for (let i = 0; i < this.control.itemCount; i++) {
        if (this.control.getItemAtIndex(i).value == val) {
          this.control.selectedIndex = i;
          break;
        }
      }
    } else {
      this.control.setAttribute("value", val);
    }
  }
  valueToPreference() {
    // We might not have a pref already set, so we guess the type from the value attribute
    let val = this.control.selectedItem.value;
    if (val == "true" || val == "false") {
      val = val == "true";
    } else if (/^-?\d+$/.test(val)) {
      val = parseInt(val, 10);
    }
    Preferences.set(this.pref, val);
  }
}
customElements.define("firefox-setting-multi", FirefoxSettingMulti);
