class XblToolbar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbar";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar", XblToolbar);
