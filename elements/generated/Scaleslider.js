class XblScaleslider extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-scaleslider");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scaleslider", XblScaleslider);
