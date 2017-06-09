class XblMenuButtonBase extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-button-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-button-base", XblMenuButtonBase);
