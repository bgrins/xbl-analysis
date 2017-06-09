class XblPopupNotification extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-popup-notification";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-notification", XblPopupNotification);
