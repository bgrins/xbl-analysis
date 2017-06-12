class XblMenubar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menubar");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set statusbar(val) {
    this.setAttribute("statusbar", val);
    return val;
  }

  get statusbar() {
    return this.getAttribute("statusbar");
  }
}
customElements.define("xbl-menubar", XblMenubar);
