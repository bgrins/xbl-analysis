/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAutocompleteProfileListitemClearButton extends MozAutocompleteProfileListitemBase {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      if (event.button != 0) { return; }
      /* global Cu */
      let { AutoCompletePopup } = ChromeUtils.import("resource://gre/modules/AutoCompletePopup.jsm", {});

      AutoCompletePopup.sendMessageToBrowser("FormAutofill:ClearForm");
    });

  }

  connectedCallback() {
    super.connectedCallback()
    if (this.delayConnectedCallback()) {
      return;
    }
    this.appendChild(MozXULElement.parseXULToFragment(`
      <div anonid="autofill-item-box" class="autofill-item-box autofill-footer">
        <div anonid="autofill-clear-button" class="autofill-footer-row autofill-button"></div>
      </div>
    `));

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-item-box"
    );
    this._clearBtn = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-clear-button"
    );

    this._adjustAcItem();

  }

  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let clearFormBtnLabel = this._stringBundle.GetStringFromName("clearFormBtnLabel2");
    this._clearBtn.textContent = clearFormBtnLabel;
  }
}

MozXULElement.implementCustomInterface(MozAutocompleteProfileListitemClearButton, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("autocomplete-profile-listitem-clear-button", MozAutocompleteProfileListitemClearButton);

}
