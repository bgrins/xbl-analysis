class XblToolbar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set toolbarName(val) {
    this.setAttribute("toolbarname", val);
    return val;
  }

  get toolbarName() {
    return this.getAttribute("toolbarname");
  }
}
customElements.define("xbl-toolbar", XblToolbar);
