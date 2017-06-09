class XblMenuseparator extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuseparator";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuseparator", XblMenuseparator);
