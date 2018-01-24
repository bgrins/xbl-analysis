class FirefoxNumberbox extends FirefoxTextbox {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="textbox-input-box numberbox-input-box" flex="1" inherits="context,disabled,focused">
        <html:input class="numberbox-input textbox-input" anonid="input" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey"></html:input>
      </xul:hbox>
      <xul:spinbuttons anonid="buttons" inherits="disabled,hidden=hidespinbuttons"></xul:spinbuttons>
    `;
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

    if (this.max < this.min) this.max = this.min;

    var value = this.inputField.value || 0;
    this._validateValue(value);

    this.addEventListener(
      "input",
      event => {
        this._valueEntered = true;
      },
      true
    );

    this.addEventListener("keypress", event => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.charCode) {
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
        this._validateValue(newval);
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
    this._validateValue(val);
    return val;
  }

  get valueNumber() {
    if (this._valueEntered) {
      var newval = this.inputField.value;
      this._validateValue(newval);
    }
    return this._value;
  }

  set min(val) {
    if (typeof val == "number") {
      this.setAttribute("min", val);
      if (this.valueNumber < val) this._validateValue(val);
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
    if (this.valueNumber > val) this._validateValue(val);
    return val;
  }

  get max() {
    var max = this.getAttribute("max");
    return max ? Number(max) : Infinity;
  }
  _modifyUp() {
    if (this.disabled || this.readOnly) return;
    var oldval = this.valueNumber;
    var newval = this._validateValue(this.valueNumber + 1);
    this.inputField.select();
    if (oldval != newval) this._fireChange();
  }
  _modifyDown() {
    if (this.disabled || this.readOnly) return;
    var oldval = this.valueNumber;
    var newval = this._validateValue(this.valueNumber - 1);
    this.inputField.select();
    if (oldval != newval) this._fireChange();
  }
  _enableDisableButtons() {
    var buttons = this.spinButtons;
    if (this.disabled || this.readOnly) {
      buttons.decreaseDisabled = buttons.increaseDisabled = true;
    } else {
      buttons.decreaseDisabled = this.valueNumber <= this.min;
      buttons.increaseDisabled = this.valueNumber >= this.max;
    }
  }
  _validateValue(aValue) {
    aValue = Number(aValue) || 0;
    aValue = Math.round(aValue);

    var min = this.min;
    var max = this.max;
    if (aValue < min) aValue = min;
    else if (aValue > max) aValue = max;

    this._valueEntered = false;
    this._value = Number(aValue);
    this.inputField.value = aValue;

    this._enableDisableButtons();

    return aValue;
  }
  _fireChange() {
    var evt = document.createEvent("Events");
    evt.initEvent("change", true, true);
    this.dispatchEvent(evt);
  }
}
customElements.define("firefox-numberbox", FirefoxNumberbox);
