class FirefoxMenubar extends XULElement {
  connectedCallback() {

    this._active = false;

    this._statusbar = null;

    this._originalStatusText = null;

    this._setupEventListeners();
  }

  set statusbar(val) {
    this.setAttribute('statusbar', val);
    return val;
  }

  get statusbar() {
    return this.getAttribute('statusbar');
  }
  _updateStatusText(itemText) {
    if (!this._active)
      return;
    var newText = itemText ? itemText : this._originalStatusText;
    if (newText != this._statusbar.label)
      this._statusbar.label = newText;
  }

  _setupEventListeners() {
    this.addEventListener("DOMMenuBarActive", (event) => {
      if (!this.statusbar) return;
      this._statusbar = document.getElementById(this.statusbar);
      if (!this._statusbar)
        return;
      this._active = true;
      this._originalStatusText = this._statusbar.label;
    });

    this.addEventListener("DOMMenuBarInactive", (event) => {
      if (!this._active)
        return;
      this._active = false;
      this._statusbar.label = this._originalStatusText;
    });

    this.addEventListener("DOMMenuItemActive", (event) => { this._updateStatusText(event.target.statusText); });

    this.addEventListener("DOMMenuItemInactive", (event) => { this._updateStatusText(""); });

  }
}