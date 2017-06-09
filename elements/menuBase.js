class XblMenuBase extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-base", XblMenuBase);
