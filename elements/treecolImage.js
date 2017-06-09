class XblTreecolImage extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-treecol-image";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-image", XblTreecolImage);
