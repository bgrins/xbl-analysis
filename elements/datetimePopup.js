class XblDatetimePopup extends XblArrowpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-datetime-popup";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetime-popup", XblDatetimePopup);
