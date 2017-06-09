class XblMenuitemBase extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menuitem-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-base", XblMenuitemBase);
