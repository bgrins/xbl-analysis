class XblTimedTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-timed-textbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timed-textbox", XblTimedTextbox);
