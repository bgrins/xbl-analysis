class XblSearchTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      // Ensure the button state is up to date:
      this.searchButton = this.searchButton;
      this._searchButtonIcon.addEventListener("click", e => this._iconClick(e));
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" inherits="context,spellcheck" align="center">
<input class="textbox-input" anonid="input" mozactionhint="search" inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,spellcheck">
</input>
<deck class="textbox-search-icons" anonid="search-icons">
<image class="textbox-search-icon" anonid="searchbutton-icon" inherits="src=image,label=searchbuttonlabel,searchbutton,disabled">
</image>
<image class="textbox-search-clear" onclick="document.getBindingParent(this)._clearSearch();" label="&searchTextBox.clear.label;" inherits="disabled">
</image>
</deck>
</hbox>`;
    let comment = document.createComment("Creating xbl-search-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 500;
  }

  get searchButton() {
    return this.getAttribute("searchbutton") == "true";
  }

  get value() {
    return this.inputField.value;
  }
  _fireCommand(me) {
    if (me._timer) clearTimeout(me._timer);
    me._timer = null;
    me.doCommand();
  }
  _iconClick() {
    if (this.searchButton) this._enterSearch();
    else this.focus();
  }
  _enterSearch() {
    if (this.disabled) return;
    if (this.searchButton && this.value && !this.readOnly)
      this._searchIcons.selectedIndex = 1;
    this._fireCommand(this);
  }
  _clearSearch() {
    if (!this.disabled && !this.readOnly && this.value) {
      this.value = "";
      this._fireCommand(this);
      this._searchIcons.selectedIndex = 0;
      return true;
    }
    return false;
  }
}
customElements.define("xbl-search-textbox", XblSearchTextbox);
