class XblTreecolBase extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-treecol-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-base", XblTreecolBase);
