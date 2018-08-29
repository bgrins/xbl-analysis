class MozDateInput extends MozDatetimeInputBase {
  connectedCallback() {
    super.connectedCallback()

    ;
    /* eslint-enable no-multi-spaces */

    this.mMinMonth = 1;
    this.mMaxMonth = 12;
    this.mMinDay = 1;
    this.mMaxDay = 31;
    this.mMinYear = 1;
    // Maximum year limited by ECMAScript date object range, year <= 275760.
    this.mMaxYear = 275760;
    this.mMonthDayLength = 2;
    this.mYearLength = 4;
    this.mMonthPageUpDownInterval = 3;
    this.mDayPageUpDownInterval = 7;
    this.mYearPageUpDownInterval = 10;

    this.buildEditFields();

    if (this.mInputElement.value) {
      this.setFieldsFromInputValue();
    }

    this._setupEventListeners();
  }

  buildEditFields() {
    const HTML_NS = "http://www.w3.org/1999/xhtml";
    let root =
      document.getAnonymousElementByAttribute(this, "anonid", "edit-wrapper");

    let yearMaxLength = this.mMaxYear.toString().length;
    this.mYearField = this.createEditField(this.mYearPlaceHolder,
      this.mYearLabel, true, this.mYearLength, yearMaxLength,
      this.mMinYear, this.mMaxYear, this.mYearPageUpDownInterval);
    this.mMonthField = this.createEditField(this.mMonthPlaceHolder,
      this.mMonthLabel, true, this.mMonthDayLength, this.mMonthDayLength,
      this.mMinMonth, this.mMaxMonth, this.mMonthPageUpDownInterval);
    this.mDayField = this.createEditField(this.mDayPlaceHolder,
      this.mDayLabel, true, this.mMonthDayLength, this.mMonthDayLength,
      this.mMinDay, this.mMaxDay, this.mDayPageUpDownInterval);

    let fragment = document.createDocumentFragment();
    let formatter = Intl.DateTimeFormat(this.mLocales, {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    formatter.formatToParts(Date.now()).map(part => {
      switch (part.type) {
        case "year":
          fragment.appendChild(this.mYearField);
          break;
        case "month":
          fragment.appendChild(this.mMonthField);
          break;
        case "day":
          fragment.appendChild(this.mDayField);
          break;
        default:
          let span = document.createElementNS(HTML_NS, "span");
          span.textContent = part.value;
          fragment.appendChild(span);
          break;
      }
    });

    root.appendChild(fragment);
  }

  clearInputFields(aFromInputElement) {
    this.log("clearInputFields");

    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (this.mMonthField && !this.mMonthField.disabled &&
      !this.mMonthField.readOnly) {
      this.clearFieldValue(this.mMonthField);
    }

    if (this.mDayField && !this.mDayField.disabled &&
      !this.mDayField.readOnly) {
      this.clearFieldValue(this.mDayField);
    }

    if (this.mYearField && !this.mYearField.disabled &&
      !this.mYearField.readOnly) {
      this.clearFieldValue(this.mYearField);
    }

    if (!aFromInputElement) {
      if (this.mInputElement.value) {
        this.mInputElement.setUserInput("");
      } else {
        this.mInputElement.updateValidityState();
      }
    }
  }

  setFieldsFromInputValue() {
    let value = this.mInputElement.value;
    if (!value) {
      this.clearInputFields(true);
      return;
    }

    this.log("setFieldsFromInputValue: " + value);
    let [year, month, day] = value.split("-");

    this.setFieldValue(this.mYearField, year);
    this.setFieldValue(this.mMonthField, month);
    this.setFieldValue(this.mDayField, day);

    this.notifyPicker();
  }

  setInputValueFromFields() {
    if (this.isAnyFieldEmpty()) {
      // Clear input element's value if any of the field has been cleared,
      // otherwise update the validity state, since it may become "not"
      // invalid if fields are not complete.
      if (this.mInputElement.value) {
        this.mInputElement.setUserInput("");
      } else {
        this.mInputElement.updateValidityState();
      }
      // We still need to notify picker in case any of the field has
      // changed.
      this.notifyPicker();
      return;
    }

    let { year, month, day } = this.getCurrentValue();

    // Convert to a valid date string according to:
    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-date-string
    year = year.toString().padStart(this.mYearLength, "0");
    month = (month < 10) ? ("0" + month) : month;
    day = (day < 10) ? ("0" + day) : day;

    let date = [year, month, day].join("-");

    if (date == this.mInputElement.value) {
      return;
    }

    this.log("setInputValueFromFields: " + date);
    this.notifyPicker();
    this.mInputElement.setUserInput(date);
  }

  setFieldsFromPicker(aValue) {
    let year = aValue.year;
    let month = aValue.month;
    let day = aValue.day;

    if (!this.isEmpty(year)) {
      this.setFieldValue(this.mYearField, year);
    }

    if (!this.isEmpty(month)) {
      this.setFieldValue(this.mMonthField, month);
    }

    if (!this.isEmpty(day)) {
      this.setFieldValue(this.mDayField, day);
    }

    // Update input element's .value if needed.
    this.setInputValueFromFields();
  }

  handleKeypress(aEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    let targetField = aEvent.originalTarget;
    let key = aEvent.key;

    if (targetField.classList.contains("numeric") && key.match(/[0-9]/)) {
      let buffer = targetField.getAttribute("typeBuffer") || "";

      buffer = buffer.concat(key);
      this.setFieldValue(targetField, buffer);

      let n = Number(buffer);
      let max = targetField.getAttribute("max");
      let maxLength = targetField.getAttribute("maxlength");
      if (buffer.length >= maxLength || n * 10 > max) {
        buffer = "";
        this.advanceToNextField();
      }
      targetField.setAttribute("typeBuffer", buffer);
      this.setInputValueFromFields();
    }
  }

  incrementFieldValue(aTargetField, aTimes) {
    let value = this.getFieldValue(aTargetField);

    // Use current date if field is empty.
    if (this.isEmpty(value)) {
      let now = new Date();

      if (aTargetField == this.mYearField) {
        value = now.getFullYear();
      } else if (aTargetField == this.mMonthField) {
        value = now.getMonth() + 1;
      } else if (aTargetField == this.mDayField) {
        value = now.getDate();
      } else {
        this.log("Field not supported in incrementFieldValue.");
        return;
      }
    }

    let min = Number(aTargetField.getAttribute("min"));
    let max = Number(aTargetField.getAttribute("max"));

    value += Number(aTimes);
    if (value > max) {
      value -= (max - min + 1);
    } else if (value < min) {
      value += (max - min + 1);
    }

    this.setFieldValue(aTargetField, value);
  }

  handleKeyboardNav(aEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    let targetField = aEvent.originalTarget;
    let key = aEvent.key;

    // Home/End key does nothing on year field.
    if (targetField == this.mYearField && (key == "Home" ||
        key == "End")) {
      return;
    }

    switch (key) {
      case "ArrowUp":
        this.incrementFieldValue(targetField, 1);
        break;
      case "ArrowDown":
        this.incrementFieldValue(targetField, -1);
        break;
      case "PageUp":
        {
          let interval = targetField.getAttribute("pginterval");
          this.incrementFieldValue(targetField, interval);
          break;
        }
      case "PageDown":
        {
          let interval = targetField.getAttribute("pginterval");
          this.incrementFieldValue(targetField, 0 - interval);
          break;
        }
      case "Home":
        let min = targetField.getAttribute("min");
        this.setFieldValue(targetField, min);
        break;
      case "End":
        let max = targetField.getAttribute("max");
        this.setFieldValue(targetField, max);
        break;
    }
    this.setInputValueFromFields();
  }

  getCurrentValue() {
    let year = this.getFieldValue(this.mYearField);
    let month = this.getFieldValue(this.mMonthField);
    let day = this.getFieldValue(this.mDayField);

    let date = { year, month, day };

    this.log("getCurrentValue: " + JSON.stringify(date));
    return date;
  }

  setFieldValue(aField, aValue) {
    if (!aField || !aField.classList.contains("numeric")) {
      return;
    }

    let value = Number(aValue);
    if (isNaN(value)) {
      this.log("NaN on setFieldValue!");
      return;
    }

    let maxLength = aField.getAttribute("maxlength");
    if (aValue.length == maxLength) {
      let min = Number(aField.getAttribute("min"));
      let max = Number(aField.getAttribute("max"));

      if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }
    }

    aField.setAttribute("rawValue", value);

    // Display formatted value based on locale.
    let minDigits = aField.getAttribute("mindigits");
    let formatted = value.toLocaleString(this.mLocales, {
      minimumIntegerDigits: minDigits,
      useGrouping: false
    });

    aField.textContent = formatted;
    aField.setAttribute("aria-valuetext", formatted);
    this.updateResetButtonVisibility();
  }

  isAnyFieldAvailable(aForPicker) {
    let { year, month, day } = this.getCurrentValue();

    return !this.isEmpty(year) || !this.isEmpty(month) ||
      !this.isEmpty(day);
  }

  isAnyFieldEmpty() {
    let { year, month, day } = this.getCurrentValue();

    return (this.isEmpty(year) || this.isEmpty(month) ||
      this.isEmpty(day));
  }

  _setupEventListeners() {

  }
}