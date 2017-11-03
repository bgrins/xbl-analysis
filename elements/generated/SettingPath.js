class FirefoxSettingPath extends FirefoxSettingBase {
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
        <xul:button type="button" anonid="button" label="FROM-DTD-settings-path-button-label" inherits="disabled" oncommand="showPicker();"></xul:button>
        <xul:label anonid="input" flex="1" crop="center" inherits="disabled"></xul:label>
      </xul:hbox>
    `;
    Object.defineProperty(this, "_value", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._value;
        return (this._value = "");
      },
      set(val) {
        delete this._value;
        return (this._value = val);
      }
    });
  }

  set value(val) {
    this._value = val;
    let label = "";
    if (val) {
      try {
        let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        file.initWithPath(val);
        label = this.hasAttribute("fullpath") ? file.path : file.leafName;
      } catch (e) {}
    }
    this.input.tooltipText = val;
    return (this.input.value = label);
  }

  get value() {
    return this._value;
  }
  showPicker() {
    var filePicker = Cc["@mozilla.org/filepicker;1"].createInstance(
      Ci.nsIFilePicker
    );
    filePicker.init(
      window,
      this.getAttribute("title"),
      this.type == "file"
        ? Ci.nsIFilePicker.modeOpen
        : Ci.nsIFilePicker.modeGetFolder
    );
    if (this.value) {
      try {
        let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        file.initWithPath(this.value);
        filePicker.displayDirectory = this.type == "file" ? file.parent : file;
        if (this.type == "file") {
          filePicker.defaultString = file.leafName;
        }
      } catch (e) {}
    }
    filePicker.open(rv => {
      if (rv != Ci.nsIFilePicker.returnCancel && filePicker.file) {
        this.value = filePicker.file.path;
        this.inputChanged();
      }
    });
  }
  valueFromPreference() {
    this.value = Preferences.get(this.pref, "");
  }
  valueToPreference() {
    Preferences.set(this.pref, this.value);
  }
}
customElements.define("firefox-setting-path", FirefoxSettingPath);
