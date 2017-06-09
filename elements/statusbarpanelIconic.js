class XblStatusbarpanelIconic extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-statusbarpanel-iconic";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbarpanel-iconic", XblStatusbarpanelIconic);
