class XblTabbox extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-tabbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabbox", XblTabbox);
