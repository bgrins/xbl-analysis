class FirefoxAutocompleteProfileListitem extends FirefoxAutocompleteProfileListitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<div anonid="autofill-item-box" class="autofill-item-box">
<div class="profile-label-col profile-item-col">
<span anonid="profile-label" class="profile-label">
</span>
</div>
<div class="profile-comment-col profile-item-col">
<span anonid="profile-comment" class="profile-comment">
</span>
</div>
</div>`;
    let comment = document.createComment(
      "Creating firefox-autocomplete-profile-listitem"
    );
    this.prepend(comment);

    try {
      this._itemBox = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "autofill-item-box"
      );
      this._label = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "profile-label"
      );
      this._comment = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "profile-comment"
      );

      this._adjustAcItem();
    } catch (e) {}
  }
  disconnectedCallback() {}

  set selected(val) {
    /* global Cu */
    if (val) {
      this.setAttribute("selected", "true");
    } else {
      this.removeAttribute("selected");
    }

    let { AutoCompletePopup } = Cu.import(
      "resource://gre/modules/AutoCompletePopup.jsm",
      {}
    );

    AutoCompletePopup.sendMessageToBrowser("FormAutofill:PreviewProfile");

    return val;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }
  _adjustAcItem() {
    this._adjustAutofillItemLayout();
    this.setAttribute("formautofillattached", "true");

    let { primary, secondary } = JSON.parse(this.getAttribute("ac-value"));

    this._label.textContent = primary;
    this._comment.textContent = secondary;
  }
}
customElements.define(
  "firefox-autocomplete-profile-listitem",
  FirefoxAutocompleteProfileListitem
);
