class XblStatusbarpanelIconicText extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-statusbarpanel-iconic-text";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-iconic-text",
  XblStatusbarpanelIconicText
);
