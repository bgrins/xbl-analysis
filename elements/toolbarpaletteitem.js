class XblToolbarpaletteitem extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarpaletteitem";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarpaletteitem", XblToolbarpaletteitem);
