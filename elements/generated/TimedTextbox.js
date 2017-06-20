class XblTimedTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
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
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-timed-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 0;
  }

  get value() {
    return this.inputField.value;
  }
  _fireCommand(me) {
    me._timer = null;
    me.doCommand();
  }
}
customElements.define("xbl-timed-textbox", XblTimedTextbox);
