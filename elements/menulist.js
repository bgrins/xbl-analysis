class XblMenulist extends XblMenulistBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menulist";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist", XblMenulist);
