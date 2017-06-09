class XblMenuVertical extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-vertical";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-vertical", XblMenuVertical);
