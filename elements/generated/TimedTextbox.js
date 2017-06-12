class XblTimedTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-timed-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timed-textbox", XblTimedTextbox);
