class XblTimeInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-time-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-time-input", XblTimeInput);
