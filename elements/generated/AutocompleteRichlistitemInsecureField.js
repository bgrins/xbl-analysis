class XblAutocompleteRichlistitemInsecureField extends XblAutocompleteRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image anonid="type-icon" class="ac-type-icon" inherits="selected,current,type">
</image>
<image anonid="site-icon" class="ac-site-icon" inherits="src=image,selected,type">
</image>
<vbox class="ac-title" align="left" inherits="">
<description class="ac-text-overflow-container">
<description anonid="title-text" class="ac-title-text" inherits="selected">
</description>
</description>
</vbox>
<hbox anonid="tags" class="ac-tags" align="center" inherits="selected">
<description class="ac-text-overflow-container">
<description anonid="tags-text" class="ac-tags-text" inherits="selected">
</description>
</description>
</hbox>
<hbox anonid="separator" class="ac-separator" align="center" inherits="selected,actiontype,type">
<description class="ac-separator-text">
</description>
</hbox>
<hbox class="ac-url" align="center" inherits="selected,actiontype">
<description class="ac-text-overflow-container">
<description anonid="url-text" class="ac-url-text" inherits="selected">
</description>
</description>
</hbox>
<hbox class="ac-action" align="center" inherits="selected,actiontype">
<description class="ac-text-overflow-container">
<description anonid="action-text" class="ac-action-text" inherits="selected">
</description>
</description>
</hbox>`;
    let comment = document.createComment(
      "Creating xbl-autocomplete-richlistitem-insecure-field"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _getSearchTokens(aSearch) {
    return [this._learnMoreString.toLowerCase()];
  }
}
customElements.define(
  "xbl-autocomplete-richlistitem-insecure-field",
  XblAutocompleteRichlistitemInsecureField
);
