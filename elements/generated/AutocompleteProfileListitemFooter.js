class FirefoxAutocompleteProfileListitemFooter extends FirefoxAutocompleteProfileListitemBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <div anonid="autofill-footer" class="autofill-item-box autofill-footer">
        <div anonid="autofill-warning" class="autofill-footer-row autofill-warning"></div>
        <div anonid="autofill-option-button" class="autofill-footer-row autofill-option-button"></div>
      </div>
    `;

    this._itemBox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "autofill-footer"
    );
    this._optionButton = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "autofill-option-button"
    );
    this._warningTextBox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "autofill-warning"
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
      let categories = data && data.categories
        ? data.categories
        : this._allFieldCategories;
      // If the length of categories is 1, that means all the fillable fields are in the same
      // category. We will change the way to inform user according to this flag. When the value
      // is true, we show "Also autofills ...", otherwise, show "Autofills ..." only.
      let hasExtraCategories = categories.length > 1;
      // Show the categories in certain order to conform with the spec.
      let orderedCategoryList = [
        { id: "address", l10nId: "category.address" },
        { id: "name", l10nId: "category.name" },
        { id: "organization", l10nId: "category.organization2" },
        { id: "tel", l10nId: "category.tel" },
        { id: "email", l10nId: "category.email" }
      ];
      let showCategories = hasExtraCategories
        ? orderedCategoryList.filter(
            category =>
              categories.includes(category.id) &&
              category.id != this._focusedCategory
          )
        : [
            orderedCategoryList.find(
              category => category.id == this._focusedCategory
            )
          ];

      let separator = this._stringBundle.GetStringFromName(
        "fieldNameSeparator"
      );
      let warningTextTmplKey = hasExtraCategories
        ? "phishingWarningMessage"
        : "phishingWarningMessage2";
      let categoriesText = showCategories
        .map(category => this._stringBundle.GetStringFromName(category.l10nId))
        .join(separator);

      this._warningTextBox.textContent = this._stringBundle.formatStringFromName(
        warningTextTmplKey,
        [categoriesText],
        1
      );
      this.parentNode.parentNode.adjustHeight();
    };

    this._adjustAcItem();

    this.addEventListener("click", event => {
      if (this._warningTextBox.contains(event.originalTarget)) {
        return;
      }

      window.openPreferences("panePrivacy", { origin: "autofillFooter" });
    });
  }

  _onCollapse() {
    /* global messageManager */

    if (this.showWarningText) {
      messageManager.removeMessageListener(
        "FormAutofill:UpdateWarningMessage",
        this._updateWarningNote
      );
    }

    this._itemBox.removeAttribute("no-warning");
  }
  _adjustAcItem() {
    /* global Cu */
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let { AppConstants } = Cu.import(
      "resource://gre/modules/AppConstants.jsm",
      {}
    );
    let buttonTextBundleKey = AppConstants.platform == "macosx"
      ? "autocompleteFooterOptionOSX"
      : "autocompleteFooterOption";
    // If the popup shows up with small layout, we should use short string to
    // have a better fit in the box.
    if (this._itemBox.getAttribute("size") == "small") {
      buttonTextBundleKey += "Short";
    }
    let buttonText = this._stringBundle.GetStringFromName(buttonTextBundleKey);
    this._optionButton.textContent = buttonText;

    let value = JSON.parse(this.getAttribute("ac-value"));

    this._allFieldCategories = value.categories;
    this._focusedCategory = value.focusedCategory;
    this.showWarningText = this._allFieldCategories && this._focusedCategory;

    if (this.showWarningText) {
      messageManager.addMessageListener(
        "FormAutofill:UpdateWarningMessage",
        this._updateWarningNote
      );

      this._updateWarningNote();
    } else {
      this._itemBox.setAttribute("no-warning", "true");
    }
  }
}
customElements.define(
  "firefox-autocomplete-profile-listitem-footer",
  FirefoxAutocompleteProfileListitemFooter
);
