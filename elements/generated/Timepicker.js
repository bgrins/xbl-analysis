class XblTimepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-timepicker");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get hour() {
    return this._dateValue.getHours();
  }

  get minute() {
    return this._dateValue.getMinutes();
  }

  get second() {
    return this._dateValue.getSeconds();
  }
  _setValueNoSync(aValue) {
    var dt = new Date(aValue);
    if (!isNaN(dt)) {
      this._dateValue = dt;
      this.setAttribute("value", this.value);
      this._updateUI(this.hourField, this.hour);
      this._updateUI(this.minuteField, this.minute);
      this._updateUI(this.secondField, this.second);
    }
  }
  _increaseOrDecrease(aDir) {
    if (this.disabled || this.readOnly) return;

    var field = this._currentField;
    if (this._valueEntered) this._setValueOnChange(field);

    if (field == this._fieldAMPM) {
      this.isPM = !this.isPM;
      this._fireEvent("change", this);
    } else {
      var oldval;
      var change = aDir;
      if (field == this.hourField) {
        oldval = this.hour;
      } else if (field == this.minuteField) {
        oldval = this.minute;
        change *= this.increment;
      } else if (field == this.secondField) {
        oldval = this.second;
      }

      var newval = this._constrainValue(field, oldval + change, false);

      if (field == this.hourField) this.hour = newval;
      else if (field == this.minuteField) this.minute = newval;
      else if (field == this.secondField) this.second = newval;

      if (oldval != newval) this._fireEvent("change", this);
    }
    field.select();
  }
  _setFieldValue(aField, aValue) {
    if (aField == this.hourField) this._dateValue.setHours(aValue);
    else if (aField == this.minuteField) this._dateValue.setMinutes(aValue);
    else if (aField == this.secondField) this._dateValue.setSeconds(aValue);

    this.setAttribute("value", this.value);
    this._updateUI(aField, aValue);

    if (this.attachedControl)
      this.attachedControl._setValueNoSync(this._dateValue);
  }
  _updateUI(aField, aValue) {
    this._valueEntered = false;

    var prependZero = false;
    if (aField == this.hourField) {
      prependZero = this.hourLeadingZero;
      if (!this.is24HourClock) {
        if (aValue >= 12) {
          if (aValue > 12) aValue -= 12;
          this._fieldAMPM.value = this.pmIndicator;
        } else {
          if (aValue == 0) aValue = 12;
          this._fieldAMPM.value = this.amIndicator;
        }
      }
    } else if (aField == this.minuteField) {
      prependZero = this.minuteLeadingZero;
    } else if (aField == this.secondField) {
      prependZero = this.secondLeadingZero;
    }

    if (prependZero && aValue < 10) aField.value = "0" + aValue;
    else aField.value = aValue;
  }
  _constrainValue(aField, aValue, aNoWrap) {
    // aNoWrap is true when the user entered a value, so just
    // constrain within limits. If false, the value is being
    // incremented or decremented, so wrap around values
    var max = aField == this.hourField ? 24 : 60;
    if (aValue < 0) return aNoWrap ? 0 : max + aValue;
    if (aValue >= max) return aNoWrap ? max - 1 : aValue - max;
    return aValue;
  }
  _init() {
    this.hourField = this._fieldOne;
    this.minuteField = this._fieldTwo;
    this.secondField = this._fieldThree;

    var numberOrder = /^(\D*)\s*(\d+)(\D*)(\d+)(\D*)(\d+)\s*(\D*)$/;

    var locale =
      Intl.DateTimeFormat().resolvedOptions().locale + "-u-ca-gregory-nu-latn";

    var pmTime = new Date(2000, 0, 1, 16, 7, 9).toLocaleTimeString(locale);
    var numberFields = pmTime.match(numberOrder);
    if (numberFields) {
      this._separatorFirst.value = numberFields[3];
      this._separatorSecond.value = numberFields[5];
      if (Number(numberFields[2]) > 12) this.is24HourClock = true;
      else this.pmIndicator = numberFields[1] || numberFields[7];
    }

    var amTime = new Date(2000, 0, 1, 1, 7, 9).toLocaleTimeString(locale);
    numberFields = amTime.match(numberOrder);
    if (numberFields) {
      this.hourLeadingZero = numberFields[2].length > 1;
      this.minuteLeadingZero = numberFields[4].length > 1;
      this.secondLeadingZero = numberFields[6].length > 1;

      if (!this.is24HourClock) {
        this.amIndicator = numberFields[1] || numberFields[7];
        if (numberFields[1]) {
          var mfield = this._fieldAMPM.parentNode;
          var mcontainer = mfield.parentNode;
          mcontainer.insertBefore(mfield, mcontainer.firstChild);
        }
        var size = (numberFields[1] || numberFields[7]).length;
        if (this.pmIndicator.length > size) size = this.pmIndicator.length;
        this._fieldAMPM.size = size;
        this._fieldAMPM.maxLength = size;
      } else {
        this._fieldAMPM.parentNode.collapsed = true;
      }
    }

    this.hideSeconds = this.hideSeconds;
  }
}
customElements.define("xbl-timepicker", XblTimepicker);
