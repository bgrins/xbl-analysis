class XblMenuButtonBase extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menu-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get buttonover() {
    return this.getAttribute("buttonover");
  }

  get buttondown() {
    return this.getAttribute("buttondown") == "true";
  }
}
customElements.define("xbl-menu-button-base", XblMenuButtonBase);
