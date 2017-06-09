class XblTree extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tree";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tree", XblTree);
