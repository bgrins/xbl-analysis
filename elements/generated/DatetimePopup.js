class XblDatetimePopup extends XblArrowpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-datetime-popup");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetime-popup", XblDatetimePopup);
