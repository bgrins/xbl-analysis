class XblBasetext extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-basetext");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-basetext", XblBasetext);
