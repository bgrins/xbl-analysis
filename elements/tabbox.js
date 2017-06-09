class XblTabbox extends XblTabBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-tabbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tabbox", XblTabbox);
