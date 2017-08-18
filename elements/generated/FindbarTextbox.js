class FirefoxFindbarTextbox extends FirefoxTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-findbar-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get findbar() {
    undefined;
  }
  _handleEnter(aEvent) {
    if (this.findbar._findMode == this.findbar.FIND_NORMAL) {
      let findString = this.findbar._findField;
      if (!findString.value) return;
      if (aEvent.getModifierState("Accel")) {
        this.findbar.getElement("highlight").click();
        return;
      }

      this.findbar.onFindAgainCommand(aEvent.shiftKey);
    } else {
      this.findbar._finishFAYT(aEvent);
    }
  }
  _handleTab(aEvent) {
    let shouldHandle = !aEvent.altKey && !aEvent.ctrlKey && !aEvent.metaKey;
    if (shouldHandle && this.findbar._findMode != this.findbar.FIND_NORMAL) {
      this.findbar._finishFAYT(aEvent);
    }
  }
}
customElements.define("firefox-findbar-textbox", FirefoxFindbarTextbox);
