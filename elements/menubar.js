class XblMenubar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menubar ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubar", XblMenubar);
