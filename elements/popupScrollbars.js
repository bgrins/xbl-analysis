class XblPopupScrollbars extends XblPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-popup-scrollbars";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-scrollbars", XblPopupScrollbars);
