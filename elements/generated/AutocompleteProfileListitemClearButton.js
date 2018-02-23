class FirefoxAutocompleteProfileListitemClearButton extends FirefoxAutocompleteProfileListitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <div anonid="autofill-item-box" class="autofill-item-box autofill-footer">
        <div anonid="autofill-clear-button" class="autofill-footer-row autofill-button"></div>
      </div>
    `;

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-item-box"
    );
    this._clearBtn = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-clear-button"
    );

    this._adjustAcItem();

    this._setupEventListeners();
  }
  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let clearFormBtnLabel = this._stringBundle.GetStringFromName("clearFormBtnLabel2");
    this._clearBtn.textContent = clearFormBtnLabel;
  }

  _setupEventListeners() {
    this.addEventListener("click", (event) => {
      /* global Cu */
      let { AutoCompletePopup } = ChromeUtils.import("resource://gre/modules/AutoCompletePopup.jsm", {});

      AutoCompletePopup.sendMessageToBrowser("FormAutofill:ClearForm");
    });

  }
}