class XblToolbarbutton extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarbutton";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton", XblToolbarbutton);
