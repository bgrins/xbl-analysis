class XblScaleslider extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-scaleslider");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scaleslider", XblScaleslider);
