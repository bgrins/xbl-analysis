class XblTimeInput extends XblDatetimeInputBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-time-input");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-time-input", XblTimeInput);
