class XblDateInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-date-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  buildEditFields() {
    const HTML_NS = "http://www.w3.org/1999/xhtml";
    let root = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );

    let yearMaxLength = this.mMaxYear.toString().length;
    this.mYearField = this.createEditField(
      this.mYearPlaceHolder,
      true,
      this.mYearLength,
      yearMaxLength,
      this.mMinYear,
      this.mMaxYear,
      this.mYearPageUpDownInterval
    );
    this.mMonthField = this.createEditField(
      this.mMonthPlaceHolder,
      true,
      this.mMonthDayLength,
      this.mMonthDayLength,
      this.mMinMonth,
      this.mMaxMonth,
      this.mMonthPageUpDownInterval
    );
    this.mDayField = this.createEditField(
      this.mDayPlaceHolder,
      true,
      this.mMonthDayLength,
      this.mMonthDayLength,
      this.mMinDay,
      this.mMaxDay,
      this.mDayPageUpDownInterval
    );

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

    if (
      this.mMonthField &&
      !this.mMonthField.disabled &&
      !this.mMonthField.readOnly
    ) {
      this.clearFieldValue(this.mMonthField);
    }

    if (
      this.mDayField &&
      !this.mDayField.disabled &&
      !this.mDayField.readOnly
    ) {
      this.clearFieldValue(this.mDayField);
    }

    if (
      this.mYearField &&
      !this.mYearField.disabled &&
      !this.mYearField.readOnly
    ) {
      this.clearFieldValue(this.mYearField);
    }

    if (!aFromInputElement) {
      this.mInputElement.setUserInput("");
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
  getDaysInMonth(aMonth, aYear) {
    // Javascript's month is 0-based, so this means last day of the
    // previous month.
    return new Date(aYear, aMonth, 0).getDate();
  }
  isFieldInvalid(aField) {
    let value = this.getFieldValue(aField);
    if (this.isEmpty(value)) {
      return true;
    }

    let min = Number(aField.getAttribute("min"));
    let max = Number(aField.getAttribute("max"));

    if (value < min || value > max) {
      return true;
    }

    return false;
  }
  setInputValueFromFields() {
    if (!this.isAnyValueAvailable(false)) {
      this.mInputElement.setUserInput("");
      return;
    }

    if (
      this.isFieldInvalid(this.mYearField) ||
      this.isFieldInvalid(this.mMonthField) ||
      this.isFieldInvalid(this.mDayField)
    ) {
      // We still need to notify picker in case any of the field has
      // changed. If we can set input element value, then notifyPicker
      // will be called in setFieldsFromInputValue().
      this.notifyPicker();
      return;
    }

    let { year, month, day } = this.getCurrentValue();
    if (day > this.getDaysInMonth(month, year)) {
      // Don't set invalid date, otherwise input element's value will be
      // set to empty.
      return;
    }

    // Convert to a valid date string according to:
    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-date-string
    year = year.toString().padStart(this.mYearLength, "0");
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    let date = [year, month, day].join("-");

    this.log("setInputValueFromFields: " + date);
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
      value -= max - min + 1;
    } else if (value < min) {
      value += max - min + 1;
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
    if (targetField == this.mYearField && (key == "Home" || key == "End")) {
      return;
    }

    switch (key) {
      case "ArrowUp":
        this.incrementFieldValue(targetField, 1);
        break;
      case "ArrowDown":
        this.incrementFieldValue(targetField, -1);
        break;
      case "PageUp": {
        let interval = targetField.getAttribute("pginterval");
        this.incrementFieldValue(targetField, interval);
        break;
      }
      case "PageDown": {
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
    this.updateResetButtonVisibility();
  }
  isAnyValueAvailable(aForPicker) {
    let { year, month, day } = this.getCurrentValue();

    return !this.isEmpty(year) || !this.isEmpty(month) || !this.isEmpty(day);
  }
}
customElements.define("xbl-date-input", XblDateInput);
