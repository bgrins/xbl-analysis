class XblGroupbox extends XblGroupboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-groupbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox", XblGroupbox);
