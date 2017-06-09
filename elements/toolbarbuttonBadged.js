class XblToolbarbuttonBadged extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarbutton-badged";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-badged", XblToolbarbuttonBadged);
