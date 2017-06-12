class XblMenuBase extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menu-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-base", XblMenuBase);
