class XblMenuButtonBase extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-button-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-button-base", XblMenuButtonBase);
