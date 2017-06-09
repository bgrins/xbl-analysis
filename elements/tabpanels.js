class XblTabpanels extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-tabpanels ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabpanels", XblTabpanels);
