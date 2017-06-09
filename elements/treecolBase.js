class XblTreecolBase extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-treecol-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-base", XblTreecolBase);
