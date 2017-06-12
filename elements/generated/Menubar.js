class XblMenubar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menubar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubar", XblMenubar);
