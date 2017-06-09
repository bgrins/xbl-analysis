class XblToolbar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-toolbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar", XblToolbar);
