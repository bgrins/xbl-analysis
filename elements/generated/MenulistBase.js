class XblMenulistBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menulist-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-base", XblMenulistBase);
