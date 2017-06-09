class XblMenulistBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-menulist-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-base", XblMenulistBase);
