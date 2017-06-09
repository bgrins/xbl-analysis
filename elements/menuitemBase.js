class XblMenuitemBase extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menuitem-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-base", XblMenuitemBase);
