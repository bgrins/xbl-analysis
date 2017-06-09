class XblSearchTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck" align="center">
<input class="textbox-input" anonid="input" mozactionhint="search" xbl:inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,spellcheck">
</input>
<deck class="textbox-search-icons" anonid="search-icons">
<image class="textbox-search-icon" anonid="searchbutton-icon" xbl:inherits="src=image,label=searchbuttonlabel,searchbutton,disabled">
</image>
<image class="textbox-search-clear" onclick="document.getBindingParent(this)._clearSearch();" label="&searchTextBox.clear.label;" xbl:inherits="disabled">
</image>
</deck>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-search-textbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-search-textbox", XblSearchTextbox);
