class XblScrollboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-scrollbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox-base", XblScrollboxBase);
