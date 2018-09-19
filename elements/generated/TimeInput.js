/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTimeInput extends MozDatetimeInputBase {
  connectedCallback() {
    super.connectedCallback()

    ;
    /* eslint-enable no-multi-spaces */

    this.mHour12 = this.is12HourTime(this.mLocales);
    this.mMillisecSeparatorText = ".";
    this.mMaxLength = 2;
    this.mMillisecMaxLength = 3;
    this.mDefaultStep = 60 * 1000; // in milliseconds

    this.mMinHour = this.mHour12 ? 1 : 0;
    this.mMaxHour = this.mHour12 ? 12 : 23;
    this.mMinMinute = 0;
    this.mMaxMinute = 59;
    this.mMinSecond = 0;
    this.mMaxSecond = 59;
    this.mMinMillisecond = 0;
    this.mMaxMillisecond = 999;

    this.mHourPageUpDownInterval = 3;
    this.mMinSecPageUpDownInterval = 10;

    this.buildEditFields();

    if (this.mInputElement.value) {
      this.setFieldsFromInputValue();
    }

  }

  get kMsPerSecond() {
    return 1000;
  }

  get kMsPerMinute() {
    return (60 * 1000);
  }

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

  hasSecondField() {
    return !!this.mSecondField;
  }

  hasMillisecField() {
    return !!this.mMillisecField;
  }

  hasDayPeriodField() {
    return !!this.mDayPeriodField;
  }

  shouldShowSecondField() {
    let { second } = this.getInputElementValues();
    if (second != undefined) {
      return true;
    }

    let stepBase = this.mInputElement.getStepBase();
    if ((stepBase % this.kMsPerMinute) != 0) {
      return true;
    }

    let step = this.mInputElement.getStep();
    if ((step % this.kMsPerMinute) != 0) {
      return true;
    }

    return false;
  }

  shouldShowMillisecField() {
    let { millisecond } = this.getInputElementValues();
    if (millisecond != undefined) {
      return true;
    }

    let stepBase = this.mInputElement.getStepBase();
    if ((stepBase % this.kMsPerSecond) != 0) {
      return true;
    }

    let step = this.mInputElement.getStep();
    if ((step % this.kMsPerSecond) != 0) {
      return true;
    }

    return false;
  }

  rebuildEditFieldsIfNeeded() {
    if ((this.shouldShowSecondField() == this.hasSecondField()) &&
      (this.shouldShowMillisecField() == this.hasMillisecField())) {
      return;
    }

    let root =
      document.getAnonymousElementByAttribute(this, "anonid", "edit-wrapper");
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
    let root =
      document.getAnonymousElementByAttribute(this, "anonid", "edit-wrapper");

    let options = {
      hour: "numeric",
      minute: "numeric",
      hour12: this.mHour12,
    };

    this.mHourField = this.createEditField(this.mHourPlaceHolder,
      this.mHourLabel, true, this.mMaxLength, this.mMaxLength,
      this.mMinHour, this.mMaxHour, this.mHourPageUpDownInterval);
    this.mMinuteField = this.createEditField(this.mMinutePlaceHolder,
      this.mMinuteLabel, true, this.mMaxLength, this.mMaxLength,
      this.mMinMinute, this.mMaxMinute, this.mMinSecPageUpDownInterval);

    if (this.mHour12) {
      this.mDayPeriodField = this.createEditField(
        this.mDayPeriodPlaceHolder, this.mDayPeriodLabel, false);

      // Give aria autocomplete hint for am/pm
      this.mDayPeriodField.setAttribute("aria-autocomplete", "inline");
    }

    if (this.shouldShowSecondField()) {
      options.second = "numeric";
      this.mSecondField = this.createEditField(this.mSecondPlaceHolder,
        this.mSecondLabel, true, this.mMaxLength, this.mMaxLength,
        this.mMinSecond, this.mMaxSecond, this.mMinSecPageUpDownInterval);

      if (this.shouldShowMillisecField()) {
        this.mMillisecField = this.createEditField(
          this.mMillisecPlaceHolder, this.mMillisecLabel, true,
          this.mMillisecMaxLength, this.mMillisecMaxLength,
          this.mMinMillisecond, this.mMaxMillisecond,
          this.mMinSecPageUpDownInterval);
      }
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
          if (this.shouldShowMillisecField()) {
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
    let keys = ["dates/gregorian/dayperiods/am",
      "dates/gregorian/dayperiods/pm"
    ];

    let result = intlUtils.getDisplayNames(this.mLocales, {
      style: "short",
      keys,
    });

    [amString, pmString] = keys.map(key => result.values[key]);

    return { amString, pmString };
  }

  is12HourTime(aLocales) {
    let options = (new Intl.DateTimeFormat(aLocales, {
      hour: "numeric",
    })).resolvedOptions();

    return options.hour12;
  }

  setFieldsFromInputValue() {
    let { hour, minute, second, millisecond } =
    this.getInputElementValues();

    if (this.isEmpty(hour) && this.isEmpty(minute)) {
      this.clearInputFields(true);
      return;
    }

    // Second and millisecond part are optional, rebuild edit fields if
    // needed.
    this.rebuildEditFieldsIfNeeded();

    this.setFieldValue(this.mHourField, hour);
    this.setFieldValue(this.mMinuteField, minute);
    if (this.mHour12) {
      this.setDayPeriodValue(hour >= this.mMaxHour ? this.mPMIndicator :
        this.mAMIndicator);
    }

    if (this.hasSecondField()) {
      this.setFieldValue(this.mSecondField,
        (second != undefined) ? second : 0);
    }

    if (this.hasMillisecField()) {
      this.setFieldValue(this.mMillisecField,
        (millisecond != undefined) ? millisecond : 0);
    }

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

    let { hour, minute, second, millisecond } = this.getCurrentValue();
    let dayPeriod = this.getDayPeriodValue();

    // Convert to a valid time string according to:
    // https://html.spec.whatwg.org/multipage/infrastructure.html#valid-time-string
    if (this.mHour12) {
      if (dayPeriod == this.mPMIndicator && hour < this.mMaxHour) {
        hour += this.mMaxHour;
      } else if (dayPeriod == this.mAMIndicator &&
        hour == this.mMaxHour) {
        hour = 0;
      }
    }

    hour = (hour < 10) ? ("0" + hour) : hour;
    minute = (minute < 10) ? ("0" + minute) : minute;

    let time = hour + ":" + minute;
    if (second != undefined) {
      second = (second < 10) ? ("0" + second) : second;
      time += ":" + second;
    }

    if (millisecond != undefined) {
      // Convert milliseconds to fraction of second.
      millisecond = millisecond.toString().padStart(
        this.mMillisecMaxLength, "0");
      time += "." + millisecond;
    }

    if (time == this.mInputElement.value) {
      return;
    }

    this.log("setInputValueFromFields: " + time);
    this.notifyPicker();
    this.mInputElement.setUserInput(time);
  }

  setFieldsFromPicker(aValue) {
    let hour = aValue.hour;
    let minute = aValue.minute;
    this.log("setFieldsFromPicker: " + hour + ":" + minute);

    if (!this.isEmpty(hour)) {
      this.setFieldValue(this.mHourField, hour);
      if (this.mHour12) {
        this.setDayPeriodValue(hour >= this.mMaxHour ? this.mPMIndicator :
          this.mAMIndicator);
      }
    }

    if (!this.isEmpty(minute)) {
      this.setFieldValue(this.mMinuteField, minute);
    }

    // Update input element's .value if needed.
    this.setInputValueFromFields();
  }

  clearInputFields(aFromInputElement) {
    this.log("clearInputFields");

    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (this.mHourField && !this.mHourField.disabled &&
      !this.mHourField.readOnly) {
      this.clearFieldValue(this.mHourField);
    }

    if (this.mMinuteField && !this.mMinuteField.disabled &&
      !this.mMinuteField.readOnly) {
      this.clearFieldValue(this.mMinuteField);
    }

    if (this.hasSecondField() && !this.mSecondField.disabled &&
      !this.mSecondField.readOnly) {
      this.clearFieldValue(this.mSecondField);
    }

    if (this.hasMillisecField() && !this.mMillisecField.disabled &&
      !this.mMillisecField.readOnly) {
      this.clearFieldValue(this.mMillisecField);
    }

    if (this.hasDayPeriodField() && !this.mDayPeriodField.disabled &&
      !this.mDayPeriodField.readOnly) {
      this.clearFieldValue(this.mDayPeriodField);
    }

    if (!aFromInputElement) {
      if (this.mInputElement.value) {
        this.mInputElement.setUserInput("");
      } else {
        this.mInputElement.updateValidityState();
      }
    }
  }

  notifyMinMaxStepAttrChanged() {
    // Second and millisecond part are optional, rebuild edit fields if
    // needed.
    this.rebuildEditFieldsIfNeeded();
    // Fill in values again.
    this.setFieldsFromInputValue();
  }

  incrementFieldValue(aTargetField, aTimes) {
    let value = this.getFieldValue(aTargetField);

    // Use current time if field is empty.
    if (this.isEmpty(value)) {
      let now = new Date();

      if (aTargetField == this.mHourField) {
        value = now.getHours();
        if (this.mHour12) {
          value = (value % this.mMaxHour) || this.mMaxHour;
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

    if (this.hasDayPeriodField() &&
      targetField == this.mDayPeriodField) {
      // Home/End key does nothing on AM/PM field.
      if (key == "Home" || key == "End") {
        return;
      }

      this.setDayPeriodValue(
        this.getDayPeriodValue() == this.mAMIndicator ? this.mPMIndicator :
        this.mAMIndicator);
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

  handleKeypress(aEvent) {
    if (this.isDisabled() || this.isReadonly()) {
      return;
    }

    let targetField = aEvent.originalTarget;
    let key = aEvent.key;

    if (this.hasDayPeriodField() &&
      targetField == this.mDayPeriodField) {
      if (key == "a" || key == "A") {
        this.setDayPeriodValue(this.mAMIndicator);
      } else if (key == "p" || key == "P") {
        this.setDayPeriodValue(this.mPMIndicator);
      }
      this.setInputValueFromFields();
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
      this.setInputValueFromFields();
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
          value = (value > this.mMaxHour) ? value % this.mMaxHour : value;
        }
      } else if (value > this.mMaxHour) {
        value = this.mMaxHour;
      }
    }

    aField.setAttribute("rawValue", value);

    let minDigits = aField.getAttribute("mindigits");
    let formatted = value.toLocaleString(this.mLocales, {
      minimumIntegerDigits: minDigits,
      useGrouping: false,
    });

    aField.textContent = formatted;
    aField.setAttribute("aria-valuetext", formatted);
    this.updateResetButtonVisibility();
  }

  getDayPeriodValue(aValue) {
    if (!this.hasDayPeriodField()) {
      return "";
    }

    let placeholder = this.mDayPeriodField.placeholder;
    let value = this.mDayPeriodField.textContent;

    return (value == placeholder ? "" : value);
  }

  setDayPeriodValue(aValue) {
    if (!this.hasDayPeriodField()) {
      return;
    }

    this.mDayPeriodField.textContent = aValue;
    this.updateResetButtonVisibility();
  }

  isAnyFieldAvailable(aForPicker) {
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

    return (this.hasDayPeriodField() && !this.isEmpty(dayPeriod)) ||
      (this.hasSecondField() && !this.isEmpty(second)) ||
      (this.hasMillisecField() && !this.isEmpty(millisecond));
  }

  isAnyFieldEmpty() {
    let { hour, minute, second, millisecond } = this.getCurrentValue();
    let dayPeriod = this.getDayPeriodValue();

    return (this.isEmpty(hour) || this.isEmpty(minute) ||
      (this.hasDayPeriodField() && this.isEmpty(dayPeriod)) ||
      (this.hasSecondField() && this.isEmpty(second)) ||
      (this.hasMillisecField() && this.isEmpty(millisecond)));
  }

  getCurrentValue() {
    let hour = this.getFieldValue(this.mHourField);
    if (!this.isEmpty(hour)) {
      if (this.mHour12) {
        let dayPeriod = this.getDayPeriodValue();
        if (dayPeriod == this.mPMIndicator && hour < this.mMaxHour) {
          hour += this.mMaxHour;
        } else if (dayPeriod == this.mAMIndicator &&
          hour == this.mMaxHour) {
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

customElements.define("time-input", MozTimeInput);

}
