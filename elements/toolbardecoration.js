class XblToolbardecoration extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbardecoration";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbardecoration", XblToolbardecoration);
