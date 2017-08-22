class FirefoxMenubar extends FirefoxToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menubar");
    this.prepend(comment);

    Object.defineProperty(this, "_active", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._active;
        return (this._active = false);
      },
      set(val) {
        delete this._active;
        return (this._active = val);
      }
    });
    Object.defineProperty(this, "_statusbar", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._statusbar;
        return (this._statusbar = null);
      },
      set(val) {
        delete this._statusbar;
        return (this._statusbar = val);
      }
    });
    Object.defineProperty(this, "_originalStatusText", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._originalStatusText;
        return (this._originalStatusText = null);
      },
      set(val) {
        delete this._originalStatusText;
        return (this._originalStatusText = val);
      }
    });

    this.addEventListener("DOMMenuBarActive", event => {
      if (!this.statusbar) return;
      this._statusbar = document.getElementById(this.statusbar);
      if (!this._statusbar) return;
      this._active = true;
      this._originalStatusText = this._statusbar.label;
    });

    this.addEventListener("DOMMenuBarInactive", event => {
      if (!this._active) return;
      this._active = false;
      this._statusbar.label = this._originalStatusText;
    });

    this.addEventListener("DOMMenuItemActive", event => {
      undefined;
    });

    this.addEventListener("DOMMenuItemInactive", event => {
      undefined;
    });
  }
  disconnectedCallback() {}

  set statusbar(val) {
    this.setAttribute("statusbar", val);
    return val;
  }

  get statusbar() {
    return this.getAttribute("statusbar");
  }
  _updateStatusText(itemText) {
    if (!this._active) return;
    var newText = itemText ? itemText : this._originalStatusText;
    if (newText != this._statusbar.label) this._statusbar.label = newText;
  }
}
customElements.define("firefox-menubar", FirefoxMenubar);
