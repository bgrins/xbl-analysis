class XblScrollboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-scrollbox-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox-base", XblScrollboxBase);
