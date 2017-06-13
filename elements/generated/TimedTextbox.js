class XblTimedTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
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
