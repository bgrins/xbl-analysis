class XblTimeInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-time-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  getInputElementValues() {
    let value = this.mInputElement.value;
    if (value.length === 0) {
      return {};
    }

    let hour, minute, second, millisecond;
    [hour, minute, second] = value.split(":");
    if (second) {
      [second, millisecond] = second.split(".");

      // Convert fraction of second to milliseconds.
      if (millisecond && millisecond.length === 1) {
        millisecond *= 100;
      } else if (millisecond && millisecond.length === 2) {
        millisecond *= 10;
      }
    }

    return { hour, minute, second, millisecond };
  }
  reBuildEditFields() {
    let root = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );
    while (root.firstChild) {
      root.firstChild.remove();
    }

    this.mHourField = null;
    this.mMinuteField = null;
    this.mSecondField = null;
    this.mMillisecField = null;

    this.buildEditFields();
  }
  buildEditFields() {
    const HTML_NS = "http://www.w3.org/1999/xhtml";
    let root = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );

    let { second, millisecond } = this.getInputElementValues();

    let options = {
      hour: "numeric",
      minute: "numeric",
      hour12: this.mHour12
    };

    this.mHourField = this.createEditField(
      this.mHourPlaceHolder,
      true,
      this.mMaxLength,
      this.mMaxLength,
      this.mMinHour,
      this.mMaxHour,
      this.mHourPageUpDownInterval
    );
    this.mMinuteField = this.createEditField(
      this.mMinutePlaceHolder,
      true,
      this.mMaxLength,
      this.mMaxLength,
      this.mMinMinute,
      this.mMaxMinute,
      this.mMinSecPageUpDownInterval
    );

    if (this.mHour12) {
      this.mDayPeriodField = this.createEditField(
        this.mDayPeriodPlaceHolder,
        false
      );
    }

    if (second != undefined) {
      options["second"] = "numeric";
      this.mSecondField = this.createEditField(
        this.mSecondPlaceHolder,
        true,
        this.mMaxLength,
        this.mMaxLength,
        this.mMinSecond,
        this.mMaxSecond,
        this.mMinSecPageUpDownInterval
      );
    }

    if (millisecond != undefined) {
      this.mMillisecField = this.createEditField(
        this.mMillisecPlaceHolder,
        true,
        this.mMillisecMaxLength,
        this.mMillisecMaxLength,
        this.mMinMillisecond,
        this.mMaxMillisecond,
        this.mMinSecPageUpDownInterval
      );
    }

    let fragment = document.createDocumentFragment();
    let formatter = Intl.DateTimeFormat(this.mLocales, options);
    formatter.formatToParts(Date.now()).map(part => {
      switch (part.type) {
        case "hour":
          fragment.appendChild(this.mHourField);
          break;
        case "minute":
          fragment.appendChild(this.mMinuteField);
          break;
        case "second":
          fragment.appendChild(this.mSecondField);
          if (millisecond != undefined) {
            // Intl.DateTimeFormat does not support millisecond, so we
            // need to handle this on our own.
            let span = document.createElementNS(HTML_NS, "span");
            span.textContent = this.mMillisecSeparatorText;
            fragment.appendChild(span);
            fragment.appendChild(this.mMillisecField);
          }
          break;
        case "dayPeriod":
          fragment.appendChild(this.mDayPeriodField);
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
  getStringsForLocale(aLocales) {
    this.log("getStringsForLocale: " + aLocales);

    let intlUtils = window.intlUtils;
    if (!intlUtils) {
      return {};
    }

    let amString, pmString;
    let keys = [
      "dates/gregorian/dayperiods/am",
      "dates/gregorian/dayperiods/pm"
    ];

    let result = intlUtils.getDisplayNames(this.mLocales, {
      style: "short",
      keys
    });

    [amString, pmString] = keys.map(key => result.values[key]);

    return { amString, pmString };
  }
  is12HourTime(aLocales) {
    let options = new Intl.DateTimeFormat(aLocales, {
      hour: "numeric"
    }).resolvedOptions();

    return options.hour12;
  }
  setFieldsFromInputValue() {
    let { hour, minute, second, millisecond } = this.getInputElementValues();

    if (this.isEmpty(hour) && this.isEmpty(minute)) {
      this.clearInputFields(true);
      return;
    }

    // Second and millsecond part is optional, rebuild edit fields if
    // needed.
    if (
      (!this.isEmpty(second) && !this.mSecondField) ||
      (this.isEmpty(second) && this.mSecondField) ||
      (!this.isEmpty(millisecond) && !this.mMillisecField) ||
      (this.isEmpty(millisecond) && this.mMillisecField)
    ) {
      this.log("Edit fields need to be rebuilt.");
      this.reBuildEditFields();
    }

    this.setFieldValue(this.mHourField, hour);
    this.setFieldValue(this.mMinuteField, minute);
    if (this.mHour12) {
      this.setDayPeriodValue(
        hour >= this.mMaxHour ? this.mPMIndicator : this.mAMIndicator
      );
    }

    if (!this.isEmpty(second)) {
      this.setFieldValue(this.mSecondField, second);
    }
    if (!this.isEmpty(millisecond)) {
      this.setFieldValue(this.mMillisecField, millisecond);
    }

    this.notifyPicker();
  }
  setInputValueFromFields() {
    if (!this.isAnyValueAvailable(false)) {
      this.mInputElement.setUserInput("");
      return;
    }

    let { hour, minute, second, millisecond } = this.getCurrentValue();
    let dayPeriod = this.getDayPeriodValue();

    if (
      this.isEmpty(hour) ||
      this.isEmpty(minute) ||
      (this.mDayPeriodField && this.isEmpty(dayPeriod)) ||
      (this.mSecondField && this.isEmpty(second)) ||
      (this.mMillisecField && this.isEmpty(millisecond))
    ) {
      // We still need to notify picker in case any of the field has
      // changed. If we can set input element value, then notifyPicker
      // will be called in setFieldsFromInputValue().
      this.notifyPicker();
      return;
    }

    // Convert to a valid time string according to:
    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-time-string
    if (this.mHour12) {
      if (dayPeriod == this.mPMIndicator && hour < this.mMaxHour) {
        hour += this.mMaxHour;
      } else if (dayPeriod == this.mAMIndicator && hour == this.mMaxHour) {
        hour = 0;
      }
    }

    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;

    let time = hour + ":" + minute;
    if (this.mSecondField) {
      second = second < 10 ? "0" + second : second;
      time += ":" + second;
    }

    if (this.mMillisecField) {
      // Convert milliseconds to fraction of second.
      millisecond = millisecond
        .toString()
        .padStart(this.mMillisecMaxLength, "0");
      time += "." + millisecond;
    }

    this.log("setInputValueFromFields: " + time);
    this.mInputElement.setUserInput(time);
  }
  setFieldsFromPicker(aValue) {
    let hour = aValue.hour;
    let minute = aValue.minute;
    this.log("setFieldsFromPicker: " + hour + ":" + minute);

    if (!this.isEmpty(hour)) {
      this.setFieldValue(this.mHourField, hour);
      if (this.mHour12) {
        this.setDayPeriodValue(
          hour >= this.mMaxHour ? this.mPMIndicator : this.mAMIndicator
        );
      }
    }

    if (!this.isEmpty(minute)) {
      this.setFieldValue(this.mMinuteField, minute);
    }
  }
  clearInputFields(aFromInputElement) {
    this.log("clearInputFields");

    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (
      this.mHourField &&
      !this.mHourField.disabled &&
      !this.mHourField.readOnly
    ) {
      this.clearFieldValue(this.mHourField);
    }

    if (
      this.mMinuteField &&
      !this.mMinuteField.disabled &&
      !this.mMinuteField.readOnly
    ) {
      this.clearFieldValue(this.mMinuteField);
    }

    if (
      this.mSecondField &&
      !this.mSecondField.disabled &&
      !this.mSecondField.readOnly
    ) {
      this.clearFieldValue(this.mSecondField);
    }

    if (
      this.mMillisecField &&
      !this.mMillisecField.disabled &&
      !this.mMillisecField.readOnly
    ) {
      this.clearFieldValue(this.mMillisecField);
    }

    if (
      this.mDayPeriodField &&
      !this.mDayPeriodField.disabled &&
      !this.mDayPeriodField.readOnly
    ) {
      this.clearFieldValue(this.mDayPeriodField);
    }

    if (!aFromInputElement) {
      this.mInputElement.setUserInput("");
    }
  }
  incrementFieldValue(aTargetField, aTimes) {
    let value = this.getFieldValue(aTargetField);

    // Use current time if field is empty.
    if (this.isEmpty(value)) {
      let now = new Date();

      if (aTargetField == this.mHourField) {
        value = now.getHours();
        if (this.mHour12) {
          value = value % this.mMaxHour || this.mMaxHour;
        }
      } else if (aTargetField == this.mMinuteField) {
        value = now.getMinutes();
      } else if (aTargetField == this.mSecondField) {
        value = now.getSeconds();
      } else if (aTargetField == this.mMillisecField) {
        value = now.getMilliseconds();
      } else {
        this.log("Field not supported in incrementFieldValue.");
        return;
      }
    }

    let min = aTargetField.getAttribute("min");
    let max = aTargetField.getAttribute("max");

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

    if (this.mDayPeriodField && targetField == this.mDayPeriodField) {
      // Home/End key does nothing on AM/PM field.
      if (key == "Home" || key == "End") {
        return;
      }

      this.setDayPeriodValue(
        this.getDayPeriodValue() == this.mAMIndicator
          ? this.mPMIndicator
          : this.mAMIndicator
      );
      this.setInputValueFromFields();
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
  handleKeypress(aEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    let targetField = aEvent.originalTarget;
    let key = aEvent.key;

    if (this.mDayPeriodField && targetField == this.mDayPeriodField) {
      if (key == "a" || key == "A") {
        this.setDayPeriodValue(this.mAMIndicator);
      } else if (key == "p" || key == "P") {
        this.setDayPeriodValue(this.mPMIndicator);
      }
      return;
    }

    if (targetField.classList.contains("numeric") && key.match(/[0-9]/)) {
      let buffer = targetField.getAttribute("typeBuffer") || "";

      buffer = buffer.concat(key);
      this.setFieldValue(targetField, buffer);

      let n = Number(buffer);
      let max = targetField.getAttribute("max");
      let maxLength = targetField.getAttribute("maxLength");
      if (buffer.length >= maxLength || n * 10 > max) {
        buffer = "";
        this.advanceToNextField();
      }
      targetField.setAttribute("typeBuffer", buffer);
    }
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

    if (aField == this.mHourField) {
      if (this.mHour12) {
        // Try to change to 12hr format if user input is 0 or greater
        // than 12.
        let maxLength = aField.getAttribute("maxlength");
        if (value == 0 && aValue.length == maxLength) {
          value = this.mMaxHour;
        } else {
          value = value > this.mMaxHour ? value % this.mMaxHour : value;
        }
      } else if (value > this.mMaxHour) {
        value = this.mMaxHour;
      }
    }

    aField.setAttribute("rawValue", value);

    let minDigits = aField.getAttribute("mindigits");
    let formatted = value.toLocaleString(this.mLocales, {
      minimumIntegerDigits: minDigits,
      useGrouping: false
    });

    aField.textContent = formatted;
    this.updateResetButtonVisibility();
  }
  getDayPeriodValue(aValue) {
    if (!this.mDayPeriodField) {
      return "";
    }

    let placeholder = this.mDayPeriodField.placeholder;
    let value = this.mDayPeriodField.textContent;

    return value == placeholder ? "" : value;
  }
  setDayPeriodValue(aValue) {
    if (!this.mDayPeriodField) {
      return;
    }

    this.mDayPeriodField.textContent = aValue;
    this.updateResetButtonVisibility();
  }
  isAnyValueAvailable(aForPicker) {
    let { hour, minute, second, millisecond } = this.getCurrentValue();
    let dayPeriod = this.getDayPeriodValue();

    let available = !this.isEmpty(hour) || !this.isEmpty(minute);
    if (available) {
      return true;
    }

    // Picker only cares about hour:minute.
    if (aForPicker) {
      return false;
    }

    return (
      (this.mDayPeriodField && !this.isEmpty(dayPeriod)) ||
      (this.mSecondField && !this.isEmpty(second)) ||
      (this.mMillisecField && !this.isEmpty(millisecond))
    );
  }
  getCurrentValue() {
    let hour = this.getFieldValue(this.mHourField);
    if (!this.isEmpty(hour)) {
      if (this.mHour12) {
        let dayPeriod = this.getDayPeriodValue();
        if (dayPeriod == this.mPMIndicator && hour < this.mMaxHour) {
          hour += this.mMaxHour;
        } else if (dayPeriod == this.mAMIndicator && hour == this.mMaxHour) {
          hour = 0;
        }
      }
    }

    let minute = this.getFieldValue(this.mMinuteField);
    let second = this.getFieldValue(this.mSecondField);
    let millisecond = this.getFieldValue(this.mMillisecField);

    let time = { hour, minute, second, millisecond };

    this.log("getCurrentValue: " + JSON.stringify(time));
    return time;
  }
}
customElements.define("xbl-time-input", XblTimeInput);
