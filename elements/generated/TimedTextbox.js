class FirefoxTimedTextbox extends FirefoxTextbox {
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "_timer", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._timer;
        return (this._timer = null);
      },
      set(val) {
        delete this._timer;
        return (this._timer = val);
      }
    });

    try {
      var consoleService = Components.classes[
        "@mozilla.org/consoleservice;1"
      ].getService(Components.interfaces.nsIConsoleService);
      var scriptError = Components.classes[
        "@mozilla.org/scripterror;1"
      ].createInstance(Components.interfaces.nsIScriptError);
      scriptError.init(
        'Timed textboxes are deprecated. Consider using type="search" instead.',
        this.ownerDocument.location.href,
        null,
        null,
        null,
        scriptError.warningFlag,
        "XUL Widgets"
      );
      consoleService.logMessage(scriptError);
    } catch (e) {}

    this.addEventListener("input", event => {
      if (this._timer) clearTimeout(this._timer);
      this._timer =
        this.timeout && setTimeout(this._fireCommand, this.timeout, this);
    });

    this.addEventListener("keypress", event => {
      if (this._timer) clearTimeout(this._timer);
      this._fireCommand(this);
      event.preventDefault();
    });
  }

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 0;
  }

  set value(val) {
    this.inputField.value = val;
    if (this._timer) clearTimeout(this._timer);
    return val;
  }

  get value() {
    return this.inputField.value;
  }
  _fireCommand(me) {
    me._timer = null;
    me.doCommand();
  }
}
customElements.define("firefox-timed-textbox", FirefoxTimedTextbox);
