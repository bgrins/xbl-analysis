class FirefoxSettingBase extends XULElement {
  connectedCallback() {
    Object.defineProperty(this, "_observer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._observer;
        return (this._observer = {
          _self: this,

          QueryInterface(aIID) {
            const Ci = Components.interfaces;
            if (
              aIID.equals(Ci.nsIObserver) ||
              aIID.equals(Ci.nsISupportsWeakReference) ||
              aIID.equals(Ci.nsISupports)
            )
              return this;

            throw Components.Exception(
              "No interface",
              Components.results.NS_ERROR_NO_INTERFACE
            );
          },

          observe(aSubject, aTopic, aPrefName) {
            if (aTopic != "nsPref:changed") return;

            if (this._self.pref == aPrefName) this._self.preferenceChanged();
          }
        });
      },
      set(val) {
        delete this._observer;
        return (this._observer = val);
      }
    });
    Object.defineProperty(this, "_updatingInput", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._updatingInput;
        return (this._updatingInput = false);
      },
      set(val) {
        delete this._updatingInput;
        return (this._updatingInput = val);
      }
    });
    Object.defineProperty(this, "input", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.input;
        return (this.input = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input"
        ));
      },
      set(val) {
        delete this.input;
        return (this.input = val);
      }
    });
    Object.defineProperty(this, "settings", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.settings;
        return (this.settings = this.parentNode.localName == "settings"
          ? this.parentNode
          : null);
      },
      set(val) {
        delete this.settings;
        return (this.settings = val);
      }
    });

    this.preferenceChanged();

    this.addEventListener("keypress", function(event) {
      event.stopPropagation();
    });

    if (this.usePref)
      Services.prefs.addObserver(this.pref, this._observer, true);
  }

  get usePref() {
    return this.hasAttribute("pref");
  }

  get pref() {
    return this.getAttribute("pref");
  }

  get type() {
    return this.getAttribute("type");
  }

  set value(val) {
    return (this.input.value = val);
  }

  get value() {
    return this.input.value;
  }
  fireEvent(eventName, funcStr) {
    let body = funcStr || this.getAttribute(eventName);
    if (!body) return;

    try {
      let event = document.createEvent("Events");
      event.initEvent(eventName, true, true);
      let f = new Function("event", body);
      f.call(this, event);
    } catch (e) {
      Cu.reportError(e);
    }
  }
  valueFromPreference() {
    // Should be code to set the from the preference input.value
    throw Components.Exception(
      "No valueFromPreference implementation",
      Components.results.NS_ERROR_NOT_IMPLEMENTED
    );
  }
  valueToPreference() {
    // Should be code to set the input.value from the preference
    throw Components.Exception(
      "No valueToPreference implementation",
      Components.results.NS_ERROR_NOT_IMPLEMENTED
    );
  }
  inputChanged() {
    if (this.usePref && !this._updatingInput) {
      this.valueToPreference();
      this.fireEvent("oninputchanged");
    }
  }
  preferenceChanged() {
    if (this.usePref) {
      this._updatingInput = true;
      try {
        this.valueFromPreference();
        this.fireEvent("onpreferencechanged");
      } catch (e) {}
      this._updatingInput = false;
    }
  }
}
customElements.define("firefox-setting-base", FirefoxSettingBase);
