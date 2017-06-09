class XblPopup extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup", XblPopup);
