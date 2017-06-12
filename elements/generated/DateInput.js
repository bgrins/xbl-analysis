class XblDateInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-date-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-date-input", XblDateInput);
