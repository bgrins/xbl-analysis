class XblButtonBase extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-button-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-base", XblButtonBase);
