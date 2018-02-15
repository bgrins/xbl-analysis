class FirefoxAutocompleteRichlistitemInsecureField extends FirefoxAutocompleteRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image anonid="type-icon" class="ac-type-icon" inherits="selected,current,type"></xul:image>
      <xul:image anonid="site-icon" class="ac-site-icon" inherits="src=image,selected,type"></xul:image>
      <xul:vbox class="ac-title" align="left" inherits="">
        <xul:description class="ac-text-overflow-container">
          <xul:description anonid="title-text" class="ac-title-text" inherits="selected"></xul:description>
        </xul:description>
      </xul:vbox>
      <xul:hbox anonid="tags" class="ac-tags" align="center" inherits="selected">
        <xul:description class="ac-text-overflow-container">
          <xul:description anonid="tags-text" class="ac-tags-text" inherits="selected"></xul:description>
        </xul:description>
      </xul:hbox>
      <xul:hbox anonid="separator" class="ac-separator" align="center" inherits="selected,actiontype,type">
        <xul:description class="ac-separator-text"></xul:description>
      </xul:hbox>
      <xul:hbox class="ac-url" align="center" inherits="selected,actiontype">
        <xul:description class="ac-text-overflow-container">
          <xul:description anonid="url-text" class="ac-url-text" inherits="selected"></xul:description>
        </xul:description>
      </xul:hbox>
      <xul:hbox class="ac-action" align="center" inherits="selected,actiontype">
        <xul:description class="ac-text-overflow-container">
          <xul:description anonid="action-text" class="ac-action-text" inherits="selected"></xul:description>
        </xul:description>
      </xul:hbox>
    `;

    // Unlike other autocomplete items, the height of the insecure warning
    // increases by wrapping. So "forceHandleUnderflow" is for container to
    // recalculate an item's height and width.
    this.classList.add("forceHandleUnderflow");

    this.addEventListener("click", (event) => {
      let baseURL = Services.urlFormatter.formatURLPref("app.support.baseURL");
      window.openUILinkIn(baseURL + "insecure-password", "tab", {
        relatedToCurrent: true,
      });
    });

  }

  get _learnMoreString() {
    if (!this.__learnMoreString) {
      this.__learnMoreString =
        Services.strings.createBundle("chrome://passwordmgr/locale/passwordmgr.properties").
      GetStringFromName("insecureFieldWarningLearnMore");
    }
    return this.__learnMoreString;
  }
  _getSearchTokens(aSearch) {
    return [this._learnMoreString.toLowerCase()];
  }
}