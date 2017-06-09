class XblDateInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-date-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-date-input", XblDateInput);
