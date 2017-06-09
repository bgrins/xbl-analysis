class XblTimedTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-timed-textbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timed-textbox", XblTimedTextbox);
