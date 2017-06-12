class XblMenuBase extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menu-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get open() {
    return this.hasAttribute("open");
  }
}
customElements.define("xbl-menu-base", XblMenuBase);
