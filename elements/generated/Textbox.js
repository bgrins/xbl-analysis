/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTextbox extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("focus", (event) => {
      if (this.hasAttribute("focused"))
        return;

      switch (event.originalTarget) {
        case this:
          // Forward focus to actual HTML input
          this.inputField.focus();
          this.setAttribute("focused", "true");
          break;
        case this.inputField:
          this.setAttribute("focused", "true");
          break;
        default:
          // Otherwise, allow other children (e.g. URL bar buttons) to get focus
          break;
      }
    }, true);

    this.addEventListener("blur", (event) => {
      this.removeAttribute("focused");
    }, true);

    this.addEventListener("mousedown", (event) => {
      this.mIgnoreClick = this.hasAttribute("focused");

      if (!this.mIgnoreClick) {
        this.setSelectionRange(0, 0);
        if (event.originalTarget == this ||
          event.originalTarget == this.inputField.parentNode)
          this.inputField.focus();
      }
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children></children>
      <moz-input-box anonid="moz-input-box" flex="1" inherits="context,spellcheck">
        <html:input class="textbox-input" anonid="input" inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,noinitialfocus,mozactionhint,spellcheck"></html:input>
      </moz-input-box>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    /**
     * nsIDOMXULLabeledControlElement
     */
    this.crop = "";

    this.image = "";

    this.command = "";

    this.accessKey = "";

    this.mInputField = null;

    this.mIgnoreClick = false;

    this.mEditor = null;

    var str = this._cachedInputFieldValue;
    if (str) {
      this.inputField.value = str;
      delete this._cachedInputFieldValue;
    }

    if (this.hasAttribute("emptytext"))
      this.placeholder = this.getAttribute("emptytext");

  }

  get inputField() {
    if (!this.mInputField)
      this.mInputField = document.getAnonymousElementByAttribute(this, "anonid", "input");
    return this.mInputField;
  }

  set value(val) {
    this.inputField.value = val;
    return val;
  }

  get value() {
    return this.inputField.value;
  }

  set defaultValue(val) {
    this.inputField.defaultValue = val;
    return val;
  }

  get defaultValue() {
    return this.inputField.defaultValue;
  }

  set label(val) {
    this.setAttribute('label', val);
    return val;
  }

  get label() {
    return this.getAttribute('label') || this.placeholder;
  }

  set placeholder(val) {
    this.inputField.placeholder = val;
    return val;
  }

  get placeholder() {
    return this.inputField.placeholder;
  }

  set emptyText(val) {
    this.placeholder = val;
    return val;
  }

  get emptyText() {
    return this.placeholder;
  }

  set type(val) {
    if (val) this.setAttribute('type', val);
    else this.removeAttribute('type');
    return val;
  }

  get type() {
    return this.getAttribute('type');
  }

  set maxLength(val) {
    this.inputField.maxLength = val;
    return val;
  }

  get maxLength() {
    return this.inputField.maxLength;
  }

  set disabled(val) {
    this.inputField.disabled = val;
    if (val) this.setAttribute('disabled', 'true');
    else this.removeAttribute('disabled');
    return val;
  }

  get disabled() {
    return this.inputField.disabled;
  }

  set tabIndex(val) {
    this.inputField.tabIndex = val;
    if (val) this.setAttribute('tabindex', val);
    else this.removeAttribute('tabindex');
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute('tabindex'));
  }

  set size(val) {
    this.inputField.size = val;
    return val;
  }

  get size() {
    return this.inputField.size;
  }

  set readOnly(val) {
    this.inputField.readOnly = val;
    if (val) this.setAttribute('readonly', 'true');
    else this.removeAttribute('readonly');
    return val;
  }

  get readOnly() {
    return this.inputField.readOnly;
  }

  get editor() {
    if (!this.mEditor) {
      this.mEditor = this.inputField.editor;
    }
    return this.mEditor;
  }

  get controllers() {
    return this.inputField.controllers
  }

  get textLength() {
    return this.inputField.textLength;
  }

  set selectionStart(val) {
    this.inputField.selectionStart = val;
    return val;
  }

  get selectionStart() {
    return this.inputField.selectionStart;
  }

  set selectionEnd(val) {
    this.inputField.selectionEnd = val;
    return val;
  }

  get selectionEnd() {
    return this.inputField.selectionEnd;
  }

  reset() {
    this.value = this.defaultValue;
    try {
      this.editor.transactionManager.clear();
      return true;
    } catch (e) {}
    return false;
  }

  select() {
    this.inputField.select();
  }

  setUserInput(value) {
    this.inputField.setUserInput(value);
  }

  setSelectionRange(aSelectionStart, aSelectionEnd) {
    // According to https://html.spec.whatwg.org/#do-not-apply,
    // setSelectionRange() is only available on a limited set of input types.
    if (this.inputField.type == "text") {
      this.inputField.setSelectionRange(aSelectionStart, aSelectionEnd);
    }
  }
  disconnectedCallback() {
    var field = this.inputField;
    if (field && field.value) {
      this._cachedInputFieldValue = field.value;
    }

    this.mInputField = null;
  }
}

customElements.define("textbox", MozTextbox);

}
