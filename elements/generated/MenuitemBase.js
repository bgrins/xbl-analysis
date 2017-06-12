class XblMenuitemBase extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menuitem-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selected() {
    return this.getAttribute("selected") == "true";
  }
}
customElements.define("xbl-menuitem-base", XblMenuitemBase);
