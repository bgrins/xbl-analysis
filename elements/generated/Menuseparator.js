class XblMenuseparator extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menuseparator");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuseparator", XblMenuseparator);
