class XblDatetimePopup extends XblArrowpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-datetime-popup ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetime-popup", XblDatetimePopup);
