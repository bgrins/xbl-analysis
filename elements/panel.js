class XblPanel extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-panel ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panel", XblPanel);
