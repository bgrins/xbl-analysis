class XblToolbardecoration extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbardecoration");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbardecoration", XblToolbardecoration);
