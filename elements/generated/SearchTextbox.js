class MozSearchTextbox extends MozTextbox {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children></children>
      <moz-input-box anonid="moz-input-box" flex="1" inherits="context,spellcheck" align="center">
        <image class="textbox-search-sign"></image>
        <html:input class="textbox-input" anonid="input" mozactionhint="search" inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,spellcheck"></html:input>
        <deck class="textbox-search-icons" anonid="search-icons">
          <image class="textbox-search-icon" anonid="searchbutton-icon" inherits="src=image,label=searchbuttonlabel,searchbutton,disabled"></image>
          <image class="textbox-search-clear" onclick="document.getBindingParent(this)._clearSearch();" label="FROM-DTD.searchTextBox.clear.label;" inherits="disabled"></image>
        </deck>
      </moz-input-box>
    `));
    this._timer = null;

    this._searchIcons = document.getAnonymousElementByAttribute(this, "anonid", "search-icons");

    this._searchButtonIcon = document.getAnonymousElementByAttribute(this, "anonid", "searchbutton-icon");

    // Ensure the button state is up to date:
    this.searchButton = this.searchButton;
    this._searchButtonIcon.addEventListener("click", (e) => this._iconClick(e));

    this._setupEventListeners();
  }

  set timeout(val) {
    this.setAttribute('timeout', val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute('timeout')) || 500;
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
    return this.getAttribute('searchbutton') == 'true';
  }

  set value(val) {
    this.inputField.value = val;

    if (val)
      this._searchIcons.selectedIndex = this.searchButton ? 0 : 1;
    else
      this._searchIcons.selectedIndex = 0;

    if (this._timer)
      clearTimeout(this._timer);

    return val;
  }

  get value() {
    return this.inputField.value;
  }

  _fireCommand(me) {
    if (me._timer)
      clearTimeout(me._timer);
    me._timer = null;
    me.doCommand();
  }

  _iconClick() {
    if (this.searchButton)
      this._enterSearch();
    else
      this.focus();
  }

  _enterSearch() {
    if (this.disabled)
      return;
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

  _setupEventListeners() {
    this.addEventListener("input", (event) => {
      if (this.searchButton) {
        this._searchIcons.selectedIndex = 0;
        return;
      }
      if (this._timer)
        clearTimeout(this._timer);
      this._timer = this.timeout && setTimeout(this._fireCommand, this.timeout, this);
      this._searchIcons.selectedIndex = this.value ? 1 : 0;
    });

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_ESCAPE) { return; }
      if (this._clearSearch()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RETURN) { return; }
      this._enterSearch();
      event.preventDefault();
      event.stopPropagation();
    });

  }
}