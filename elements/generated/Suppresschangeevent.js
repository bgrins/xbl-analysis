class XblSuppresschangeevent extends XblScale {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-suppresschangeevent");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-suppresschangeevent", XblSuppresschangeevent);
