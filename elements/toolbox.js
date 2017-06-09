class XblToolbox extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-toolbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbox", XblToolbox);
