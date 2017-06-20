class XblNumberbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      if (this.max < this.min) this.max = this.min;

      var dsymbol = Number(5.4).toLocaleString().match(/\D/);
      if (dsymbol != null) this.decimalSymbol = dsymbol[0];

      var value = this.inputField.value || 0;
      this._validateValue(value, false);
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="textbox-input-box numberbox-input-box" flex="1" inherits="context,disabled,focused">
<input class="numberbox-input textbox-input" anonid="input" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey">
</input>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled,hidden=hidespinbuttons">
</spinbuttons>`;
    let comment = document.createComment("Creating xbl-numberbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set value(val) {
    return (this.valueNumber = val);
  }

  get value() {
    return "" + this.valueNumber;
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
customElements.define("xbl-numberbox", XblNumberbox);
