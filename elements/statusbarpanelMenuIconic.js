class XblStatusbarpanelMenuIconic extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-statusbarpanel-menu-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-menu-iconic",
  XblStatusbarpanelMenuIconic
);
