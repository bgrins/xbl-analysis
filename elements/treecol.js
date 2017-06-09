class XblTreecol extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-treecol";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol", XblTreecol);
