/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAutocompleteProfileListitemFooter extends MozAutocompleteProfileListitemBase {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      if (event.button != 0) {
        return;
      }

      if (this._warningTextBox.contains(event.originalTarget)) {
        return;
      }

      window.openPreferences("privacy-form-autofill", { origin: "autofillFooter" });
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <div anonid="autofill-footer" class="autofill-item-box autofill-footer">
        <div anonid="autofill-warning" class="autofill-footer-row autofill-warning"></div>
        <div anonid="autofill-option-button" class="autofill-footer-row autofill-button"></div>
      </div>
    `));

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-footer"
    );
    this._optionButton = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-option-button"
    );
    this._warningTextBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-warning"
    );

    /**
     * A handler for updating warning message once selectedIndex has been changed.
     *
     * There're three different states of warning message:
     * 1. None of addresses were selected: We show all the categories intersection of fields in the
     *    form and fields in the results.
     * 2. An address was selested: Show the additional categories that will also be filled.
     * 3. An address was selected, but the focused category is the same as the only one category: Only show
     * the exact category that we're going to fill in.
     *
     * @private
     * @param {string[]} data.categories
     *        The categories of all the fields contained in the selected address.
     */
    this._updateWarningNote = ({ data } = {}) => {
      let categories = (data && data.categories) ? data.categories : this._allFieldCategories;
      // If the length of categories is 1, that means all the fillable fields are in the same
      // category. We will change the way to inform user according to this flag. When the value
      // is true, we show "Also autofills ...", otherwise, show "Autofills ..." only.
      let hasExtraCategories = categories.length > 1;
      // Show the categories in certain order to conform with the spec.
      let orderedCategoryList = [{ id: "address", l10nId: "category.address" },
        { id: "name", l10nId: "category.name" },
        { id: "organization", l10nId: "category.organization2" },
        { id: "tel", l10nId: "category.tel" },
        { id: "email", l10nId: "category.email" }
      ];
      let showCategories = hasExtraCategories ?
        orderedCategoryList.filter(category => categories.includes(category.id) && category.id != this._focusedCategory) : [orderedCategoryList.find(category => category.id == this._focusedCategory)];

      let separator = this._stringBundle.GetStringFromName("fieldNameSeparator");
      let warningTextTmplKey = hasExtraCategories ? "phishingWarningMessage" : "phishingWarningMessage2";
      let categoriesText = showCategories.map(category => this._stringBundle.GetStringFromName(category.l10nId)).join(separator);

      this._warningTextBox.textContent = this._stringBundle.formatStringFromName(warningTextTmplKey, [categoriesText], 1);
      this.parentNode.parentNode.adjustHeight();
    };

    this._adjustAcItem();

  }

  _onCollapse() {
    /* global messageManager */

    if (this.showWarningText) {
      messageManager.removeMessageListener("FormAutofill:UpdateWarningMessage", this._updateWarningNote);
    }

    this._itemBox.removeAttribute("no-warning");
  }

  _adjustAcItem() {
    /* global Cu */
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let { AppConstants } = ChromeUtils.import("resource://gre/modules/AppConstants.jsm");
    // TODO: The "Short" suffix is pointless now as normal version string is no longer needed,
    // we should consider removing the suffix if possible when the next time locale change.
    let buttonTextBundleKey = AppConstants.platform == "macosx" ?
      "autocompleteFooterOptionOSXShort" : "autocompleteFooterOptionShort";
    let buttonText = this._stringBundle.GetStringFromName(buttonTextBundleKey);
    this._optionButton.textContent = buttonText;

    let value = JSON.parse(this.getAttribute("ac-value"));

    this._allFieldCategories = value.categories;
    this._focusedCategory = value.focusedCategory;
    this.showWarningText = this._allFieldCategories && this._focusedCategory;

    if (this.showWarningText) {
      messageManager.addMessageListener("FormAutofill:UpdateWarningMessage", this._updateWarningNote);

      this._updateWarningNote();
    } else {
      this._itemBox.setAttribute("no-warning", "true");
    }
  }
}

MozXULElement.implementCustomInterface(MozAutocompleteProfileListitemFooter, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("autocomplete-profile-listitem-footer", MozAutocompleteProfileListitemFooter);

}
