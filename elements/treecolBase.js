class XblTreecolBase extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-treecol-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-base", XblTreecolBase);
