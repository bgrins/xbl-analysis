class XblButtonBase extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-button-base ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-base", XblButtonBase);
