class FirefoxNumberbox extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:hbox class="textbox-input-box numberbox-input-box" flex="1" inherits="context,disabled,focused">
<html:input class="numberbox-input textbox-input" anonid="input" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey">
</html:input>
</xul:hbox>
<xul:spinbuttons anonid="buttons" inherits="disabled,hidden=hidespinbuttons">
</xul:spinbuttons>`;
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
    Object.defineProperty(this, "_spinButtons", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._spinButtons;
        return (this._spinButtons = null);
      },
      set(val) {
        delete this._spinButtons;
        return (this._spinButtons = val);
      }
    });
    Object.defineProperty(this, "_value", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._value;
        return (this._value = 0);
      },
      set(val) {
        delete this._value;
        return (this._value = val);
      }
    });
    Object.defineProperty(this, "decimalSymbol", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.decimalSymbol;
        return (this.decimalSymbol = ".");
      },
      set(val) {
        delete this.decimalSymbol;
        return (this.decimalSymbol = val);
      }
    });

    if (this.max < this.min) this.max = this.min;

    var dsymbol = Number(5.4).toLocaleString().match(/\D/);
    if (dsymbol != null) this.decimalSymbol = dsymbol[0];

    var value = this.inputField.value || 0;
    this._validateValue(value, false);

    this.addEventListener(
      "input",
      event => {
        this._valueEntered = true;
      },
      true
    );

    this.addEventListener("keypress", event => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.charCode) {
        if (
          event.charCode == this.decimalSymbol.charCodeAt(0) &&
          this.decimalPlaces &&
          String(this.inputField.value).indexOf(this.decimalSymbol) == -1
        )
          return;

        if (event.charCode == 45 && this.min < 0) return;

        if (event.charCode < 48 || event.charCode > 57) event.preventDefault();
      }
    });

    this.addEventListener("keypress", event => {
      this._modifyUp();
    });

    this.addEventListener("keypress", event => {
      this._modifyDown();
    });

    this.addEventListener("up", event => {
      this._modifyUp();
    });

    this.addEventListener("down", event => {
      this._modifyDown();
    });

    this.addEventListener("change", event => {
      if (event.originalTarget == this.inputField) {
        var newval = this.inputField.value;
        newval = newval.replace(this.decimalSymbol, ".");
        this._validateValue(newval, false);
      }
    });
  }

  get spinButtons() {
    if (!this._spinButtons)
      this._spinButtons = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "buttons"
      );
    return this._spinButtons;
  }

  set value(val) {
    return (this.valueNumber = val);
  }

  get value() {
    return "" + this.valueNumber;
  }

  set valueNumber(val) {
    this._validateValue(val, false);
    return val;
  }

  get valueNumber() {
    if (this._valueEntered) {
      var newval = this.inputField.value;
      newval = newval.replace(this.decimalSymbol, ".");
      this._validateValue(newval, false);
    }
    return this._value;
  }

  set wrapAround(val) {
    if (val) this.setAttribute("wraparound", "true");
    else this.removeAttribute("wraparound");
    this._enableDisableButtons();
    return val;
  }

  get wrapAround() {
    return this.getAttribute("wraparound") == "true";
  }

  set min(val) {
    if (typeof val == "number") {
      this.setAttribute("min", val);
      if (this.valueNumber < val) this._validateValue(val, false);
    }
    return val;
  }

  get min() {
    var min = this.getAttribute("min");
    return min ? Number(min) : 0;
  }

  set max(val) {
    if (typeof val != "number") return val;
    var min = this.min;
    if (val < min) val = min;
    this.setAttribute("max", val);
    if (this.valueNumber > val) this._validateValue(val, false);
    return val;
  }

  get max() {
    var max = this.getAttribute("max");
    return max ? Number(max) : Infinity;
  }

  set decimalPlaces(val) {
    if (typeof val == "number") {
      this.setAttribute("decimalplaces", val);
      this._validateValue(this.valueNumber, false);
    }
    return val;
  }

  get decimalPlaces() {
    var places = this.getAttribute("decimalplaces");
    return places ? Number(places) : 0;
  }

  set increment(val) {
    if (typeof val == "number") this.setAttribute("increment", val);
    return val;
  }

  get increment() {
    var increment = this.getAttribute("increment");
    return increment ? Number(increment) : 1;
  }
  decrease() {
    return this._validateValue(this.valueNumber - this.increment, true);
  }
  increase() {
    return this._validateValue(this.valueNumber + this.increment, true);
  }
  _modifyUp() {
    if (this.disabled || this.readOnly) return;
    var oldval = this.valueNumber;
    var newval = this.increase();
    this.inputField.select();
    if (oldval != newval) this._fireChange();
  }
  _modifyDown() {
    if (this.disabled || this.readOnly) return;
    var oldval = this.valueNumber;
    var newval = this.decrease();
    this.inputField.select();
    if (oldval != newval) this._fireChange();
  }
  _enableDisableButtons() {
    var buttons = this.spinButtons;
    if (this.wrapAround) {
      buttons.decreaseDisabled = buttons.increaseDisabled = false;
    } else if (this.disabled || this.readOnly) {
      buttons.decreaseDisabled = buttons.increaseDisabled = true;
    } else {
      buttons.decreaseDisabled = this.valueNumber <= this.min;
      buttons.increaseDisabled = this.valueNumber >= this.max;
    }
  }
  _validateValue(aValue, aIsIncDec) {
    aValue = Number(aValue) || 0;

    var min = this.min;
    var max = this.max;
    var wrapAround = this.wrapAround && min != -Infinity && max != Infinity;
    if (aValue < min) aValue = aIsIncDec && wrapAround ? max : min;
    else if (aValue > max) aValue = aIsIncDec && wrapAround ? min : max;

    var places = this.decimalPlaces;
    aValue = places == Infinity ? "" + aValue : aValue.toFixed(places);

    this._valueEntered = false;
    this._value = Number(aValue);
    this.inputField.value = aValue.replace(/\./, this.decimalSymbol);

    if (!wrapAround) this._enableDisableButtons();

    return aValue;
  }
  _fireChange() {
    var evt = document.createEvent("Events");
    evt.initEvent("change", true, true);
    this.dispatchEvent(evt);
  }
}
customElements.define("firefox-numberbox", FirefoxNumberbox);
