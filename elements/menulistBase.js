class XblMenulistBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-menulist-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-base", XblMenulistBase);
