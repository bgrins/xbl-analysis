class XblDatetimeInputBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      this.DEBUG = false;
      this.mInputElement = this.parentNode;
      this.mLocales = window.getAppLocalesAsBCP47();

      this.mIsRTL = false;
      let intlUtils = window.intlUtils;
      if (intlUtils) {
        this.mIsRTL =
          intlUtils.getLocaleInfo(this.mLocales).direction === "rtl";
      }

      if (this.mIsRTL) {
        let inputBoxWrapper = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "input-box-wrapper"
        );
        inputBoxWrapper.dir = "rtl";
      }

      this.mMin = this.mInputElement.min;
      this.mMax = this.mInputElement.max;
      this.mStep = this.mInputElement.step;
      this.mIsPickerOpen = false;

      this.mResetButton = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "reset-button"
      );
      this.mResetButton.style.visibility = "hidden";

      this.EVENTS.forEach(eventName => {
        this.addEventListener(eventName, this, { mozSystemGroup: true });
      });
      // Handle keypress separately since we need to catch it on capturing.
      this.addEventListener("keypress", this, {
        capture: true,
        mozSystemGroup: true
      });
      // This is to close the picker when input element blurs.
      this.mInputElement.addEventListener("blur", this, {
        mozSystemGroup: true
      });
    } catch (e) {}

    console.log(this, "connected");

    this.innerHTML = `<div class="datetime-input-box-wrapper" anonid="input-box-wrapper" inherits="context,disabled,readonly">
<span class="datetime-input-edit-wrapper" anonid="edit-wrapper">
</span>
<button class="datetime-reset-button" anonid="reset-button" tabindex="-1" inherits="disabled">
</button>
</div>`;
    let comment = document.createComment("Creating xbl-datetime-input-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  log(aMsg) {
    if (this.DEBUG) {
      dump("[DateTimeBox] " + aMsg + "\n");
    }
  }
  createEditField(
    aPlaceHolder,
    aIsNumeric,
    aMinDigits,
    aMaxLength,
    aMinValue,
    aMaxValue,
    aPageUpDownInterval
  ) {
    const HTML_NS = "http://www.w3.org/1999/xhtml";

    let field = document.createElementNS(HTML_NS, "span");
    field.classList.add("datetime-edit-field");
    field.textContent = aPlaceHolder;
    field.placeholder = aPlaceHolder;
    field.tabIndex = this.mInputElement.tabIndex;

    field.setAttribute("readonly", this.mInputElement.readOnly);
    field.setAttribute("disabled", this.mInputElement.disabled);
    // Set property as well for convenience.
    field.disabled = this.mInputElement.disabled;
    field.readOnly = this.mInputElement.readOnly;

    if (aIsNumeric) {
      field.classList.add("numeric");
      // Maximum value allowed.
      field.setAttribute("min", aMinValue);
      // Minumim value allowed.
      field.setAttribute("max", aMaxValue);
      // Interval when pressing pageUp/pageDown key.
      field.setAttribute("pginterval", aPageUpDownInterval);
      // Used to store what the user has already typed in the field,
      // cleared when value is cleared and when field is blurred.
      field.setAttribute("typeBuffer", "");
      // Used to store the non-formatted number, clered when value is
      // cleared.
      field.setAttribute("rawValue", "");
      // Minimum digits to display, padded with leading 0s.
      field.setAttribute("mindigits", aMinDigits);
      // Maximum length for the field, will be advance to the next field
      // automatically if exceeded.
      field.setAttribute("maxlength", aMaxLength);

      if (this.mIsRTL) {
        // Force the direction to be "ltr", so that the field stays in the
        // same order even when it's empty (with placeholder). By using
        // "embed", the text inside the element is still displayed based
        // on its directionality.
        field.style.unicodeBidi = "embed";
        field.style.direction = "ltr";
      }
    }

    return field;
  }
  updateResetButtonVisibility() {
    if (this.isAnyFieldAvailable(false)) {
      this.mResetButton.style.visibility = "visible";
    } else {
      this.mResetButton.style.visibility = "hidden";
    }
  }
  focusInnerTextBox() {
    this.log("Focus inner editable field.");

    let editRoot = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );

    for (let child = editRoot.firstChild; child; child = child.nextSibling) {
      if (
        child instanceof HTMLSpanElement &&
        child.classList.contains("datetime-edit-field")
      ) {
        this.mLastFocusedField = child;
        child.focus();
        break;
      }
    }
  }
  blurInnerTextBox() {
    this.log("Blur inner editable field.");

    if (this.mLastFocusedField) {
      this.mLastFocusedField.blur();
    } else {
      // If .mLastFocusedField hasn't been set, blur all editable fields,
      // so that the bound element will actually be blurred. Note that
      // blurring on a element that has no focus won't have any effect.
      let editRoot = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "edit-wrapper"
      );
      for (let child = editRoot.firstChild; child; child = child.nextSibling) {
        if (
          child instanceof HTMLSpanElement &&
          child.classList.contains("datetime-edit-field")
        ) {
          child.blur();
        }
      }
    }
  }
  notifyInputElementValueChanged() {
    this.log("inputElementValueChanged");
    this.setFieldsFromInputValue();
  }
  setValueFromPicker(aValue) {
    this.setFieldsFromPicker(aValue);
  }
  hasBadInput() {
    // Incomplete field does not imply bad input.
    if (this.isAnyFieldEmpty()) {
      return false;
    }

    // All fields are available but input element's value is empty implies
    // it has been sanitized.
    if (!this.mInputElement.value) {
      return true;
    }

    return false;
  }
  advanceToNextField(aReverse) {
    this.log("advanceToNextField");

    let focusedInput = this.mLastFocusedField;
    let next = aReverse
      ? focusedInput.previousElementSibling
      : focusedInput.nextElementSibling;
    if (!next && !aReverse) {
      this.setInputValueFromFields();
      return;
    }

    while (next) {
      if (
        next instanceof HTMLSpanElement &&
        next.classList.contains("datetime-edit-field")
      ) {
        next.focus();
        break;
      }
      next = aReverse ? next.previousElementSibling : next.nextElementSibling;
    }
  }
  setPickerState(aIsOpen) {
    this.log("picker is now " + (aIsOpen ? "opened" : "closed"));
    this.mIsPickerOpen = aIsOpen;
  }
  setEditAttribute(aName, aValue) {
    this.log("setAttribute: " + aName + "=" + aValue);

    if (aName != "tabindex" && aName != "disabled" && aName != "readonly") {
      return;
    }

    let editRoot = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );

    for (let child = editRoot.firstChild; child; child = child.nextSibling) {
      if (
        child instanceof HTMLSpanElement &&
        child.classList.contains("datetime-edit-field")
      ) {
        switch (aName) {
          case "tabindex":
            child.setAttribute(aName, aValue);
            break;
          case "disabled": {
            let value = this.mInputElement.disabled;
            child.setAttribute("disabled", value);
            child.disabled = value;
            break;
          }
          case "readonly": {
            let value = this.mInputElement.readOnly;
            child.setAttribute("readonly", value);
            child.readOnly = value;
            break;
          }
        }
      }
    }
  }
  removeEditAttribute(aName) {
    this.log("removeAttribute: " + aName);

    if (aName != "tabindex" && aName != "disabled" && aName != "readonly") {
      return;
    }

    let editRoot = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "edit-wrapper"
    );

    for (let child = editRoot.firstChild; child; child = child.nextSibling) {
      if (
        child instanceof HTMLSpanElement &&
        child.classList.contains("datetime-edit-field")
      ) {
        child.removeAttribute(aName);
        // Update property as well.
        if (aName == "readonly") {
          child.readOnly = false;
        } else if (aName == "disabled") {
          child.disabled = false;
        }
      }
    }
  }
  isEmpty(aValue) {}
  getFieldValue(aField) {
    if (!aField || !aField.classList.contains("numeric")) {
      return undefined;
    }

    let value = aField.getAttribute("rawValue");
    // Avoid returning 0 when field is empty.
    return this.isEmpty(value) ? undefined : Number(value);
  }
  clearFieldValue(aField) {
    aField.textContent = aField.placeholder;
    if (aField.classList.contains("numeric")) {
      aField.setAttribute("typeBuffer", "");
      aField.setAttribute("rawValue", "");
    }
    this.updateResetButtonVisibility();
  }
  setFieldValue() {}
  clearInputFields() {}
  setFieldsFromInputValue() {}
  setInputValueFromFields() {}
  setFieldsFromPicker() {}
  handleKeypress() {}
  handleKeyboardNav() {}
  getCurrentValue() {}
  isAnyFieldAvailable() {}
  notifyPicker() {
    if (this.mIsPickerOpen && this.isAnyFieldAvailable(true)) {
      this.mInputElement.updateDateTimePicker(this.getCurrentValue());
    }
  }
  isDisabled() {
    return this.mInputElement.hasAttribute("disabled");
  }
  isReadonly() {
    return this.mInputElement.hasAttribute("readonly");
  }
  handleEvent(aEvent) {
    this.log("handleEvent: " + aEvent.type);

    switch (aEvent.type) {
      case "keypress": {
        this.onKeyPress(aEvent);
        break;
      }
      case "click": {
        this.onClick(aEvent);
        break;
      }
      case "focus": {
        this.onFocus(aEvent);
        break;
      }
      case "blur": {
        this.onBlur(aEvent);
        break;
      }
      case "mousedown": {
        if (aEvent.originalTarget == this.mResetButton) {
          aEvent.preventDefault();
        }
        break;
      }
      case "copy":
      case "cut":
      case "paste": {
        aEvent.preventDefault();
        break;
      }
      default:
        break;
    }
  }
  onFocus(aEvent) {
    this.log("onFocus originalTarget: " + aEvent.originalTarget);

    if (document.activeElement != this.mInputElement) {
      return;
    }

    let target = aEvent.originalTarget;
    if (
      target instanceof HTMLSpanElement &&
      target.classList.contains("datetime-edit-field")
    ) {
      if (target.disabled) {
        return;
      }
      this.mLastFocusedField = target;
      this.mInputElement.setFocusState(true);
    }
  }
  onBlur(aEvent) {
    this.log(
      "onBlur originalTarget: " +
        aEvent.originalTarget +
        " target: " +
        aEvent.target
    );

    if (aEvent.target == this.mInputElement && this.mIsPickerOpen) {
      this.mInputElement.closeDateTimePicker();
    }

    let target = aEvent.originalTarget;
    target.setAttribute("typeBuffer", "");
    this.setInputValueFromFields();
    this.mInputElement.setFocusState(false);
  }
  onKeyPress(aEvent) {
    this.log("onKeyPress key: " + aEvent.key);

    switch (aEvent.key) {
      // Close picker on Enter, Escape or Space key.
      case "Enter":
      case "Escape":
      case " ": {
        if (this.mIsPickerOpen) {
          this.mInputElement.closeDateTimePicker();
          aEvent.preventDefault();
        }
        break;
      }
      case "Backspace": {
        let targetField = aEvent.originalTarget;
        this.clearFieldValue(targetField);
        this.setInputValueFromFields();
        aEvent.preventDefault();
        break;
      }
      case "ArrowRight":
      case "ArrowLeft": {
        this.advanceToNextField(!(aEvent.key == "ArrowRight"));
        aEvent.preventDefault();
        break;
      }
      case "ArrowUp":
      case "ArrowDown":
      case "PageUp":
      case "PageDown":
      case "Home":
      case "End": {
        this.handleKeyboardNav(aEvent);
        aEvent.preventDefault();
        break;
      }
      default: {
        // printable characters
        if (
          aEvent.keyCode == 0 &&
          !(aEvent.ctrlKey || aEvent.altKey || aEvent.metaKey)
        ) {
          this.handleKeypress(aEvent);
          aEvent.preventDefault();
        }
        break;
      }
    }
  }
  onClick(aEvent) {
    this.log("onClick originalTarget: " + aEvent.originalTarget);

    // XXX: .originalTarget is not expected.
    // When clicking on one of the inner text boxes, the .originalTarget is
    // a HTMLDivElement and when clicking on the reset button, it's a
    // HTMLButtonElement.
    if (aEvent.defaultPrevented || this.isDisabled() || this.isReadonly()) {
      return;
    }

    if (aEvent.originalTarget == this.mResetButton) {
      this.clearInputFields(false);
    } else if (!this.mIsPickerOpen) {
      this.mInputElement.openDateTimePicker(this.getCurrentValue());
    }
  }
}
customElements.define("xbl-datetime-input-base", XblDatetimeInputBase);
