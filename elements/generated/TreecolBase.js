class XblTreecolBase extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-treecol-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-base", XblTreecolBase);
