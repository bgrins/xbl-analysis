class AutocompleteRichlistitemInsecureField extends AutocompleteRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image anonid="type-icon" class="ac-type-icon" inherits="selected,current,type"></image>
      <image anonid="site-icon" class="ac-site-icon" inherits="src=image,selected,type"></image>
      <vbox class="ac-title" align="left" inherits="">
        <description class="ac-text-overflow-container">
          <description anonid="title-text" class="ac-title-text" inherits="selected"></description>
        </description>
      </vbox>
      <hbox anonid="tags" class="ac-tags" align="center" inherits="selected">
        <description class="ac-text-overflow-container">
          <description anonid="tags-text" class="ac-tags-text" inherits="selected"></description>
        </description>
      </hbox>
      <hbox anonid="separator" class="ac-separator" align="center" inherits="selected,actiontype,type">
        <description class="ac-separator-text"></description>
      </hbox>
      <hbox class="ac-url" align="center" inherits="selected,actiontype">
        <description class="ac-text-overflow-container">
          <description anonid="url-text" class="ac-url-text" inherits="selected"></description>
        </description>
      </hbox>
      <hbox class="ac-action" align="center" inherits="selected,actiontype">
        <description class="ac-text-overflow-container">
          <description anonid="action-text" class="ac-action-text" inherits="selected"></description>
        </description>
      </hbox>
    `));

    // Unlike other autocomplete items, the height of the insecure warning
    // increases by wrapping. So "forceHandleUnderflow" is for container to
    // recalculate an item's height and width.
    this.classList.add("forceHandleUnderflow");

    this._setupEventListeners();
  }

  get _learnMoreString() {
    if (!this.__learnMoreString) {
      this.__learnMoreString =
        Services.strings.createBundle("chrome://passwordmgr/locale/passwordmgr.properties").
      GetStringFromName("insecureFieldWarningLearnMore");
    }
    return this.__learnMoreString;
  }

  /**
   * Override _getSearchTokens to have the Learn More text emphasized
   */
  _getSearchTokens(aSearch) {
    return [this._learnMoreString.toLowerCase()];
  }

  _setupEventListeners() {
    this.addEventListener("click", (event) => {
      let baseURL = Services.urlFormatter.formatURLPref("app.support.baseURL");
      window.openTrustedLinkIn(baseURL + "insecure-password", "tab", {
        relatedToCurrent: true,
      });
    });

  }
}