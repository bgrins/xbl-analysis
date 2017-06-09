class XblNumberbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-numberbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-numberbox", XblNumberbox);
