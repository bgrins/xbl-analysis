class XblMenu extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu", XblMenu);
