class XblPopupBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-popup-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-base", XblPopupBase);
