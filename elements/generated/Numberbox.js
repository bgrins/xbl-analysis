class FirefoxNumberbox extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="textbox-input-box numberbox-input-box" flex="1" inherits="context,disabled,focused">
<input class="numberbox-input textbox-input" anonid="input" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey">
</input>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled,hidden=hidespinbuttons">
</spinbuttons>`;
    let comment = document.createComment("Creating firefox-numberbox");
    this.prepend(comment);

    Object.defineProperty(this, "_valueEntered", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._valueEntered;
        return (this._valueEntered = false);
      }
    });
    Object.defineProperty(this, "_spinButtons", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._spinButtons;
        return (this._spinButtons = null);
      }
    });
    Object.defineProperty(this, "_value", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._value;
        return (this._value = 0);
      }
    });
    Object.defineProperty(this, "decimalSymbol", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.decimalSymbol;
        return (this.decimalSymbol = ".");
      }
    });

    try {
      if (this.max < this.min) this.max = this.min;

      var dsymbol = Number(5.4).toLocaleString().match(/\D/);
      if (dsymbol != null) this.decimalSymbol = dsymbol[0];

      var value = this.inputField.value || 0;
      this._validateValue(value, false);
    } catch (e) {}
  }
  disconnectedCallback() {}

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
    undefined;
  }

  get valueNumber() {
    undefined;
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
    undefined;
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
    undefined;
  }

  set decimalPlaces(val) {
    undefined;
  }

  get decimalPlaces() {
    undefined;
  }

  set increment(val) {
    if (typeof val == "number") this.setAttribute("increment", val);
    return val;
  }

  get increment() {
    undefined;
  }
  decrease() {}
  increase() {}
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
  _fireChange() {}
}
customElements.define("firefox-numberbox", FirefoxNumberbox);
