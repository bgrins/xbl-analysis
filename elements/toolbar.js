class XblToolbar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbar ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar", XblToolbar);
