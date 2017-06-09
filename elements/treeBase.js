class XblTreeBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tree-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tree-base", XblTreeBase);
