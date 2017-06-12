class XblToolbardecoration extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-toolbardecoration");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbardecoration", XblToolbardecoration);
