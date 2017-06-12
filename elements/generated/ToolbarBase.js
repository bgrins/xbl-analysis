class XblToolbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar-base", XblToolbarBase);
