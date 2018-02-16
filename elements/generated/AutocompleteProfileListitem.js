class FirefoxAutocompleteProfileListitem extends FirefoxAutocompleteProfileListitemBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <div anonid="autofill-item-box" class="autofill-item-box" inherits="ac-image">
        <div class="profile-label-col profile-item-col">
          <span anonid="profile-label-affix" class="profile-label-affix"></span>
          <span anonid="profile-label" class="profile-label"></span>
        </div>
        <div class="profile-comment-col profile-item-col">
          <span anonid="profile-comment" class="profile-comment"></span>
        </div>
      </div>
    `;

    this._itemBox = document.getAnonymousElementByAttribute(
      this, "anonid", "autofill-item-box"
    );
    this._labelAffix = document.getAnonymousElementByAttribute(
      this, "anonid", "profile-label-affix"
    );
    this._label = document.getAnonymousElementByAttribute(
      this, "anonid", "profile-label"
    );
    this._comment = document.getAnonymousElementByAttribute(
      this, "anonid", "profile-comment"
    );

    this._adjustAcItem();

    this.setupHandlers();
  }

  set selected(val) {
    /* global Cu */
    if (val) {
      this.setAttribute("selected", "true");
    } else {
      this.removeAttribute("selected");
    }

    let { AutoCompletePopup } = ChromeUtils.import("resource://gre/modules/AutoCompletePopup.jsm", {});

    AutoCompletePopup.sendMessageToBrowser("FormAutofill:PreviewProfile");

    return val;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }
  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");
    this._itemBox.style.setProperty("--primary-icon", `url(${this.getAttribute("ac-image")})`);

    let { primaryAffix, primary, secondary } = JSON.parse(this.getAttribute("ac-value"));

    this._labelAffix.textContent = primaryAffix;
    this._label.textContent = primary;
    this._comment.textContent = secondary;
  }

  setupHandlers() {

  }
}