class XblToolbox extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbox", XblToolbox);
