class XblMenuBase extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-base", XblMenuBase);
