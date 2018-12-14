/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozNumberbox extends MozTextbox {
  constructor() {
    super();

    this.addEventListener("input", (event) => {
      this._valueEntered = true;
    }, true);

    this.addEventListener("keypress", (event) => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey && event.charCode) {
        if (event.charCode == 45 && this.min < 0)
          return;

        if (event.charCode < 48 || event.charCode > 57)
          event.preventDefault();
      }
    });

    this.addEventListener("change", (event) => {
      if (event.originalTarget == this.inputField) {
        this._validateValue(this.inputField.value);
      }
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <moz-input-box anonid="moz-input-box" class="numberbox-input-box" flex="1" inherits="context,disabled,focused">
        <html:input class="numberbox-input textbox-input" type="number" anonid="input" inherits="value,min,max,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey"></html:input>
      </moz-input-box>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    this._valueEntered = false;

    this._value = 0;

    if (this.max < this.min)
      this.max = this.min;

    var value = this.inputField.value || 0;
    this._validateValue(value);

  }

  set value(val) {
    return this.valueNumber = val;
  }

  get value() {
    return String(this.valueNumber)
  }

  set valueNumber(val) {
    this._validateValue(val);
    return val;
  }

  get valueNumber() {
    if (this._valueEntered) {
      var newval = this.inputField.value;
      this._validateValue(newval);
    }
    return this._value;
  }

  set min(val) {
    if (typeof val == "number") {
      this.setAttribute("min", val);
      if (this.valueNumber < val)
        this._validateValue(val);
    }
    return val;
  }

  get min() {
    var min = this.getAttribute("min");
    return min ? Number(min) : 0;
  }

  set max(val) {
    if (typeof val != "number")
      return val;
    var min = this.min;
    if (val < min)
      val = min;
    this.setAttribute("max", val);
    if (this.valueNumber > val)
      this._validateValue(val);
    return val;
  }

  get max() {
    var max = this.getAttribute("max");
    return max ? Number(max) : Infinity;
  }

  _validateValue(aValue) {
    aValue = Number(aValue) || 0;
    aValue = Math.round(aValue);

    var min = this.min;
    var max = this.max;
    if (aValue < min)
      aValue = min;
    else if (aValue > max)
      aValue = max;

    this._valueEntered = false;
    this._value = Number(aValue);
    this.inputField.value = aValue;

    return aValue;
  }

  _fireChange() {
    var evt = document.createEvent("Events");
    evt.initEvent("change", true, true);
    this.dispatchEvent(evt);
  }
}

customElements.define("numberbox", MozNumberbox);

}
