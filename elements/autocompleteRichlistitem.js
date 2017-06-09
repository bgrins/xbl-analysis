class XblAutocompleteRichlistitem extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image anonid="type-icon" class="ac-type-icon" xbl:inherits="selected,current,type">
</image>
<image anonid="site-icon" class="ac-site-icon" xbl:inherits="src=image,selected,type">
</image>
<hbox class="ac-title" align="center" xbl:inherits="selected">
<description class="ac-text-overflow-container">
<description anonid="title-text" class="ac-title-text" xbl:inherits="selected">
</description>
</description>
</hbox>
<hbox anonid="tags" class="ac-tags" align="center" xbl:inherits="selected">
<description class="ac-text-overflow-container">
<description anonid="tags-text" class="ac-tags-text" xbl:inherits="selected">
</description>
</description>
</hbox>
<hbox anonid="separator" class="ac-separator" align="center" xbl:inherits="selected,actiontype,type">
<description class="ac-separator-text">
</description>
</hbox>
<hbox class="ac-url" align="center" xbl:inherits="selected,actiontype">
<description class="ac-text-overflow-container">
<description anonid="url-text" class="ac-url-text" xbl:inherits="selected">
</description>
</description>
</hbox>
<hbox class="ac-action" align="center" xbl:inherits="selected,actiontype">
<description class="ac-text-overflow-container">
<description anonid="action-text" class="ac-action-text" xbl:inherits="selected">
</description>
</description>
</hbox>`;
    let comment = document.createComment(
      "Creating xbl-autocomplete-richlistitem"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-autocomplete-richlistitem",
  XblAutocompleteRichlistitem
);
