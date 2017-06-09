class XblMenuseparator extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menuseparator ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuseparator", XblMenuseparator);
