class XblMenuseparator extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menuseparator");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuseparator", XblMenuseparator);
