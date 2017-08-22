class FirefoxDatepicker extends FirefoxDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-datepicker");
    this.prepend(comment);

    Object.defineProperty(this, "yearLeadingZero", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.yearLeadingZero;
        return (this.yearLeadingZero = false);
      },
      set(val) {
        delete this.yearLeadingZero;
        return (this.yearLeadingZero = val);
      }
    });
    Object.defineProperty(this, "monthLeadingZero", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.monthLeadingZero;
        return (this.monthLeadingZero = true);
      },
      set(val) {
        delete this.monthLeadingZero;
        return (this.monthLeadingZero = val);
      }
    });
    Object.defineProperty(this, "dateLeadingZero", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.dateLeadingZero;
        return (this.dateLeadingZero = true);
      },
      set(val) {
        delete this.dateLeadingZero;
        return (this.dateLeadingZero = val);
      }
    });
    Object.defineProperty(this, "yearField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.yearField;
        return (this.yearField = "");
      },
      set(val) {
        delete this.yearField;
        return (this.yearField = val);
      }
    });
    Object.defineProperty(this, "monthField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.monthField;
        return (this.monthField = "");
      },
      set(val) {
        delete this.monthField;
        return (this.monthField = val);
      }
    });
    Object.defineProperty(this, "dateField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.dateField;
        return (this.dateField = "");
      },
      set(val) {
        delete this.dateField;
        return (this.dateField = val);
      }
    });
  }
  disconnectedCallback() {}

  set value(val) {
    var results = val.match(/^([0-9]{1,4})\-([0-9]{1,2})\-([0-9]{1,2})$/);
    if (!results) throw "Invalid Date";

    this.dateValue = new Date(results[1] + "/" + results[2] + "/" + results[3]);
    this.setAttribute("value", this.value);
    return val;
  }

  get value() {
    var month = this._dateValue.getMonth();
    month = month < 9 ? (month = "0" + ++month) : month + 1;

    var date = this._dateValue.getDate();
    if (date < 10) date = "0" + date;
    return this._dateValue.getFullYear() + "-" + month + "-" + date;
  }

  set year(val) {
    var valnum = Number(val);
    if (isNaN(valnum) || valnum < 1 || valnum > 9999) throw "Invalid Year";
    this._setFieldValue(this.yearField, valnum);
    return val;
  }

  get year() {
    return this._dateValue.getFullYear();
  }

  set month(val) {
    var valnum = Number(val);
    if (isNaN(valnum) || valnum < 0 || valnum > 11) throw "Invalid Month";
    this._setFieldValue(this.monthField, valnum);
    return val;
  }

  get month() {
    return this._dateValue.getMonth();
  }

  set date(val) {
    var valnum = Number(val);
    if (isNaN(valnum) || valnum < 1 || valnum > 31) throw "Invalid Date";
    this._setFieldValue(this.dateField, valnum);
    return val;
  }

  get date() {
    return this._dateValue.getDate();
  }

  set open(val) {
    return val;
  }

  get open() {
    return false;
  }

  set displayedMonth(val) {
    this.month = val;
    return val;
  }

  get displayedMonth() {
    return this.month;
  }

  set displayedYear(val) {
    this.year = val;
    return val;
  }

  get displayedYear() {
    return this.year;
  }
  _setValueNoSync(aValue) {
    var dt = new Date(aValue);
    if (!isNaN(dt)) {
      this._dateValue = dt;
      this.setAttribute("value", this.value);
      this._updateUI(this.yearField, this.year);
      this._updateUI(this.monthField, this.month);
      this._updateUI(this.dateField, this.date);
    }
  }
  _increaseOrDecrease(aDir) {
    if (this.disabled || this.readOnly) return;

    var field = this._currentField;
    if (this._valueEntered) this._setValueOnChange(field);

    var oldval;
    if (field == this.yearField) oldval = this.year;
    else if (field == this.monthField) oldval = this.month;
    else if (field == this.dateField) oldval = this.date;

    var newval = this._constrainValue(field, oldval + aDir, false);

    if (field == this.yearField) this.year = newval;
    else if (field == this.monthField) this.month = newval;
    else if (field == this.dateField) this.date = newval;

    if (oldval != newval) this._fireEvent("change", this);
    field.select();
  }
  _setFieldValue(aField, aValue) {
    if (aField == this.yearField) {
      let oldDate = this.date;
      this._dateValue.setFullYear(aValue);
      if (oldDate != this.date) {
        this._dateValue.setDate(0);
        this._updateUI(this.dateField, this.date);
      }
    } else if (aField == this.monthField) {
      let oldDate = this.date;
      this._dateValue.setMonth(aValue);
      if (oldDate != this.date) {
        this._dateValue.setDate(0);
        this._updateUI(this.dateField, this.date);
      }
    } else if (aField == this.dateField) {
      this._dateValue.setDate(aValue);
    }

    this.setAttribute("value", this.value);
    this._updateUI(aField, aValue);

    if (this.attachedControl)
      this.attachedControl._setValueNoSync(this._dateValue);
  }
  _updateUI(aField, aValue) {
    this._valueEntered = false;

    var prependZero = false;
    if (aField == this.yearField) {
      if (this.yearLeadingZero) {
        aField.value = ("000" + aValue).slice(-4);
        return;
      }
    } else if (aField == this.monthField) {
      aValue++;
      prependZero = this.monthLeadingZero;
    } else if (aField == this.dateField) {
      prependZero = this.dateLeadingZero;
    }
    if (prependZero && aValue < 10) aField.value = "0" + aValue;
    else aField.value = aValue;
  }
  _constrainValue(aField, aValue, aNoWrap) {
    // the month will be 1 to 12 if entered by the user, so subtract 1
    if (aNoWrap && aField == this.monthField) aValue--;

    if (aField == this.dateField) {
      if (aValue < 1) return new Date(this.year, this.month + 1, 0).getDate();

      var currentMonth = this.month;
      var dt = new Date(this.year, currentMonth, aValue);
      return dt.getMonth() != currentMonth ? 1 : aValue;
    }
    var min = aField == this.monthField ? 0 : 1;
    var max = aField == this.monthField ? 11 : 9999;
    if (aValue < min) return aNoWrap ? min : max;
    if (aValue > max) return aNoWrap ? max : min;
    return aValue;
  }
  _init() {
    // We'll default to YYYY/MM/DD to start.
    var yfield = "input-one";
    var mfield = "input-two";
    var dfield = "input-three";
    var twoDigitYear = false;
    this.yearLeadingZero = true;
    this.monthLeadingZero = true;
    this.dateLeadingZero = true;

    var numberOrder = /^(\D*)\s*(\d+)(\D*)(\d+)(\D*)(\d+)\s*(\D*)$/;

    var locale =
      Intl.DateTimeFormat().resolvedOptions().locale + "-u-ca-gregory-nu-latn";

    var dt = new Date(2002, 9, 4).toLocaleDateString(locale);
    var numberFields = dt.match(numberOrder);
    if (numberFields) {
      this._separatorFirst.value = numberFields[3];
      this._separatorSecond.value = numberFields[5];

      var yi = 2,
        mi = 4,
        di = 6;

      function fieldForNumber(i) {
        if (i == 2) return "input-one";
        if (i == 4) return "input-two";
        return "input-three";
      }

      for (var i = 1; i < numberFields.length; i++) {
        switch (Number(numberFields[i])) {
          case 2:
            twoDigitYear = true; // fall through
          case 2002:
            yi = i;
            yfield = fieldForNumber(i);
            break;
          case (9, 10):
            mi = i;
            mfield = fieldForNumber(i);
            break;
          case 4:
            di = i;
            dfield = fieldForNumber(i);
            break;
        }
      }

      this.yearLeadingZero = numberFields[yi].length > 1;
      this.monthLeadingZero = numberFields[mi].length > 1;
      this.dateLeadingZero = numberFields[di].length > 1;
    }

    this.yearField = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      yfield
    );
    if (!twoDigitYear)
      this.yearField.parentNode.classList.add(
        "datetimepicker-input-subbox",
        "datetimepicker-year"
      );
    this.monthField = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      mfield
    );
    this.dateField = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      dfield
    );

    this._fieldAMPM.parentNode.collapsed = true;
    this.yearField.size = twoDigitYear ? 2 : 4;
    this.yearField.maxLength = twoDigitYear ? 2 : 4;
  }
}
customElements.define("firefox-datepicker", FirefoxDatepicker);
