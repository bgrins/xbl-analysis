class FirefoxDatetimepickerBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox class="datetimepicker-input-box" align="center" inherits="context,disabled,readonly">
<xul:hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:label anonid="sep-first" class="datetimepicker-separator" value=":">
</xul:label>
<xul:hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:label anonid="sep-second" class="datetimepicker-separator" value=":">
</xul:label>
<xul:hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
<xul:hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<html:input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" inherits="disabled,readonly">
</html:input>
</xul:hbox>
</xul:hbox>
<xul:spinbuttons anonid="buttons" inherits="disabled" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</xul:spinbuttons>`;
    Object.defineProperty(this, "_dateValue", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dateValue;
        return (this._dateValue = null);
      },
      set(val) {
        delete this._dateValue;
        return (this._dateValue = val);
      }
    });
    Object.defineProperty(this, "_fieldOne", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._fieldOne;
        return (this._fieldOne = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input-one"
        ));
      },
      set(val) {
        delete this._fieldOne;
        return (this._fieldOne = val);
      }
    });
    Object.defineProperty(this, "_fieldTwo", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._fieldTwo;
        return (this._fieldTwo = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input-two"
        ));
      },
      set(val) {
        delete this._fieldTwo;
        return (this._fieldTwo = val);
      }
    });
    Object.defineProperty(this, "_fieldThree", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._fieldThree;
        return (this._fieldThree = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input-three"
        ));
      },
      set(val) {
        delete this._fieldThree;
        return (this._fieldThree = val);
      }
    });
    Object.defineProperty(this, "_fieldAMPM", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._fieldAMPM;
        return (this._fieldAMPM = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input-ampm"
        ));
      },
      set(val) {
        delete this._fieldAMPM;
        return (this._fieldAMPM = val);
      }
    });
    Object.defineProperty(this, "_separatorFirst", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._separatorFirst;
        return (this._separatorFirst = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "sep-first"
        ));
      },
      set(val) {
        delete this._separatorFirst;
        return (this._separatorFirst = val);
      }
    });
    Object.defineProperty(this, "_separatorSecond", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._separatorSecond;
        return (this._separatorSecond = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "sep-second"
        ));
      },
      set(val) {
        delete this._separatorSecond;
        return (this._separatorSecond = val);
      }
    });
    Object.defineProperty(this, "_lastFocusedField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._lastFocusedField;
        return (this._lastFocusedField = null);
      },
      set(val) {
        delete this._lastFocusedField;
        return (this._lastFocusedField = val);
      }
    });
    Object.defineProperty(this, "_hasEntry", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._hasEntry;
        return (this._hasEntry = true);
      },
      set(val) {
        delete this._hasEntry;
        return (this._hasEntry = val);
      }
    });
    Object.defineProperty(this, "_valueEntered", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._valueEntered;
        return (this._valueEntered = false);
      },
      set(val) {
        delete this._valueEntered;
        return (this._valueEntered = val);
      }
    });
    Object.defineProperty(this, "attachedControl", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.attachedControl;
        return (this.attachedControl = null);
      },
      set(val) {
        delete this.attachedControl;
        return (this.attachedControl = val);
      }
    });

    this._init();

    var cval = this.getAttribute("value");
    if (cval) {
      try {
        this.value = cval;
        return;
      } catch (ex) {}
    }
    this.dateValue = new Date();

    this.addEventListener(
      "focus",
      event => {
        var target = event.originalTarget;
        if (
          target == this._fieldOne ||
          target == this._fieldTwo ||
          target == this._fieldThree ||
          target == this._fieldAMPM
        )
          this._lastFocusedField = target;
      },
      true
    );

    this.addEventListener("keypress", event => {
      if (
        this._hasEntry &&
        event.charCode &&
        this._currentField != this._fieldAMPM &&
        !(event.altKey || event.ctrlKey || event.metaKey) &&
        (event.charCode < 48 || event.charCode > 57)
      )
        event.preventDefault();
    });

    this.addEventListener("keypress", event => {
      if (this._hasEntry) this._increaseOrDecrease(1);
    });

    this.addEventListener("keypress", event => {
      if (this._hasEntry) this._increaseOrDecrease(-1);
    });

    this.addEventListener("input", event => {
      this._valueEntered = true;
    });

    this.addEventListener("change", event => {
      this._setValueOnChange(event.originalTarget);
    });
  }
  disconnectedCallback() {
    if (this.attachedControl) {
      this.attachedControl.attachedControl = null;
      this.attachedControl = null;
    }
  }

  get _currentField() {
    var focusedInput = document.activeElement;
    if (
      focusedInput == this._fieldOne ||
      focusedInput == this._fieldTwo ||
      focusedInput == this._fieldThree ||
      focusedInput == this._fieldAMPM
    )
      return focusedInput;
    return this._lastFocusedField || this._fieldOne;
  }

  set dateValue(val) {
    if (!(val instanceof Date)) throw "Invalid Date";

    this._setValueNoSync(val);
    if (this.attachedControl) this.attachedControl._setValueNoSync(val);
    return val;
  }

  get dateValue() {
    return new Date(this._dateValue);
  }

  set readOnly(val) {
    if (val) this.setAttribute("readonly", "true");
    else this.removeAttribute("readonly");
    return val;
  }

  get readOnly() {
    return this.getAttribute("readonly") == "true";
  }
  _fireEvent(aEventName, aTarget) {
    var event = document.createEvent("Events");
    event.initEvent(aEventName, true, true);
    return !aTarget.dispatchEvent(event);
  }
  _setValueOnChange(aField) {
    if (!this._hasEntry) return;

    if (
      aField == this._fieldOne ||
      aField == this._fieldTwo ||
      aField == this._fieldThree
    ) {
      var value = Number(aField.value);
      if (isNaN(value)) value = 0;

      value = this._constrainValue(aField, value, true);
      this._setFieldValue(aField, value);
    }
  }
  _init() {}
}
customElements.define("firefox-datetimepicker-base", FirefoxDatetimepickerBase);
