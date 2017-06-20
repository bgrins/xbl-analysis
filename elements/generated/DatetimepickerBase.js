class XblDatetimepickerBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="datetimepicker-input-box" align="center" inherits="context,disabled,readonly">
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-one" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<xbl-text-label anonid="sep-first" class="datetimepicker-separator" value=":">
</xbl-text-label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<xbl-text-label anonid="sep-second" class="datetimepicker-separator" value=":">
</xbl-text-label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-three" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-ampm" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
</hbox>
<spinbuttons anonid="buttons" inherits="disabled" onup="this.parentNode._increaseOrDecrease(1);" ondown="this.parentNode._increaseOrDecrease(-1);">
</spinbuttons>`;
    let comment = document.createComment("Creating xbl-datetimepicker-base");
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}

  get _currentField() {
    undefined;
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
  _fireEvent(aEventName, aTarget) {}
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
customElements.define("xbl-datetimepicker-base", XblDatetimepickerBase);
