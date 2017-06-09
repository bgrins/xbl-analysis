class XblToolbarbuttonBadgedMenu extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarbutton-badged-menu";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbarbutton-badged-menu",
  XblToolbarbuttonBadgedMenu
);
