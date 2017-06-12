class XblMenuButtonBase extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menu-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-button-base", XblMenuButtonBase);
