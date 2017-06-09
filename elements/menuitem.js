class XblMenuitem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuitem";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem", XblMenuitem);
