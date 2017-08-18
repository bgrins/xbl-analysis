class FirefoxSearchTextbox extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" inherits="context,spellcheck" align="center">
<image class="textbox-search-sign">
</image>
<input class="textbox-input" anonid="input" mozactionhint="search" inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,spellcheck">
</input>
<deck class="textbox-search-icons" anonid="search-icons">
<image class="textbox-search-icon" anonid="searchbutton-icon" inherits="src=image,label=searchbuttonlabel,searchbutton,disabled">
</image>
<image class="textbox-search-clear" onclick="document.getBindingParent(this)._clearSearch();" label="&searchTextBox.clear.label;" inherits="disabled">
</image>
</deck>
</hbox>`;
    let comment = document.createComment("Creating firefox-search-textbox");
    this.prepend(comment);

    try {
      // Ensure the button state is up to date:
      this.searchButton = this.searchButton;
      this._searchButtonIcon.addEventListener("click", e => this._iconClick(e));
    } catch (e) {}
    this._timer = null;
    this._searchIcons = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "search-icons"
    );
    this._searchButtonIcon = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "searchbutton-icon"
    );
  }
  disconnectedCallback() {}

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 500;
  }

  set searchButton(val) {
    if (val) {
      this.setAttribute("searchbutton", "true");
      this.removeAttribute("aria-autocomplete");
      // Hack for the button to get the right accessible:
      this._searchButtonIcon.setAttribute("onclick", "true");
    } else {
      this.removeAttribute("searchbutton");
      this._searchButtonIcon.removeAttribute("onclick");
      this.setAttribute("aria-autocomplete", "list");
    }
    return val;
  }

  get searchButton() {
    return this.getAttribute("searchbutton") == "true";
  }

  set value(val) {
    this.inputField.value = val;

    if (val) this._searchIcons.selectedIndex = this.searchButton ? 0 : 1;
    else this._searchIcons.selectedIndex = 0;

    if (this._timer) clearTimeout(this._timer);

    return val;
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
customElements.define("firefox-search-textbox", FirefoxSearchTextbox);
