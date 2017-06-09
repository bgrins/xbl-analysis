class XblButtonBase extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-base", XblButtonBase);
