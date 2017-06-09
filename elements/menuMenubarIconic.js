class XblMenuMenubarIconic extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-menubar-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-menubar-iconic", XblMenuMenubarIconic);
