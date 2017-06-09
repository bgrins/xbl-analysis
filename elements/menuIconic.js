class XblMenuIconic extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-iconic", XblMenuIconic);
