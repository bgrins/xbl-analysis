class XblPanel extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-panel";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panel", XblPanel);
