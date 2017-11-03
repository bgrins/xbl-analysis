class FirefoxCheckboxRadio extends FirefoxCheckboxBaseline {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:radiogroup anonid="group" inherits="disabled">
        <xul:radio anonid="on" class="checkbox-radio-on" label="FROM-DTD-checkbox-yes-label" inherits="label=onlabel"></xul:radio>
        <xul:radio anonid="off" class="checkbox-radio-off" label="FROM-DTD-checkbox-no-label" inherits="label=offlabel"></xul:radio>
      </xul:radiogroup>
    `;
    Object.defineProperty(this, "_group", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._group;
        return (this._group = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "group"
        ));
      },
      set(val) {
        delete this._group;
        return (this._group = val);
      }
    });
    Object.defineProperty(this, "_on", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._on;
        return (this._on = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "on"
        ));
      },
      set(val) {
        delete this._on;
        return (this._on = val);
      }
    });
    Object.defineProperty(this, "_off", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._off;
        return (this._off = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "off"
        ));
      },
      set(val) {
        delete this._off;
        return (this._off = val);
      }
    });

    this.setChecked(this.checked);
  }

  set onlabel(val) {
    this._on.label = val;
  }

  get onlabel() {
    return this._on.label;
  }

  set offlabel(val) {
    this._off.label = val;
  }

  get offlabel() {
    return this._off.label;
  }
  setChecked(aValue) {
    var change = aValue != this.checked;
    if (aValue) {
      this.setAttribute("checked", "true");
      this._group.selectedItem = this._on;
    } else {
      this.removeAttribute("checked");
      this._group.selectedItem = this._off;
    }

    if (change) {
      var event = document.createEvent("Events");
      event.initEvent("CheckboxStateChange", true, true);
      this.dispatchEvent(event);
    }
    return aValue;
  }
}
customElements.define("firefox-checkbox-radio", FirefoxCheckboxRadio);
