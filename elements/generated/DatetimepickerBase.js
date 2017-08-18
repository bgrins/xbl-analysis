class FirefoxDatetimepickerBase extends FirefoxBasecontrol {
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
<firefox-text-label anonid="sep-first" class="datetimepicker-separator" value=":">
</firefox-text-label>
<hbox class="textbox-input-box datetimepicker-input-subbox" align="center">
<input class="datetimepicker-input textbox-input" anonid="input-two" size="2" maxlength="2" inherits="disabled,readonly">
</input>
</hbox>
<firefox-text-label anonid="sep-second" class="datetimepicker-separator" value=":">
</firefox-text-label>
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
    let comment = document.createComment(
      "Creating firefox-datetimepicker-base"
    );
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
    this._dateValue = null;
    this._fieldOne = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "input-one"
    );
    this._fieldTwo = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "input-two"
    );
    this._fieldThree = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "input-three"
    );
    this._fieldAMPM = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "input-ampm"
    );
    this._separatorFirst = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "sep-first"
    );
    this._separatorSecond = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "sep-second"
    );
    this._lastFocusedField = null;
    this._hasEntry = true;
    this._valueEntered = false;
    this.attachedControl = null;
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
customElements.define("firefox-datetimepicker-base", FirefoxDatetimepickerBase);
