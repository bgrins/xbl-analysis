class XblSuppresschangeevent extends XblScale {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-suppresschangeevent");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-suppresschangeevent", XblSuppresschangeevent);
