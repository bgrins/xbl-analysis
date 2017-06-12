class XblTreeBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-tree-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tree-base", XblTreeBase);
