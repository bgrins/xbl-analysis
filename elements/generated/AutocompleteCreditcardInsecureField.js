/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAutocompleteCreditcardInsecureField extends MozAutocompleteProfileListitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <div anonid="autofill-item-box" class="autofill-insecure-item"></div>
    `));

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-item-box"
    );

    this._adjustAcItem();

  }

  set selected(val) {
    // Make this item unselectable since we see this item as a pure message.
    return false;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let value = this.getAttribute("ac-value");
    this._itemBox.textContent = value;
  }
}

MozXULElement.implementCustomInterface(MozAutocompleteCreditcardInsecureField, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("autocomplete-creditcard-insecure-field", MozAutocompleteCreditcardInsecureField);

}
