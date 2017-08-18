class XblToolbarMenubarStub extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbar-menubar-stub");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get toolbox() {
    if (this._toolbox) return this._toolbox;

    if (this.parentNode && this.parentNode.localName == "toolbox") {
      this._toolbox = this.parentNode;
    }

    return this._toolbox;
  }

  get currentSet() {
    return this.getAttribute("defaultset");
  }
  insertItem() {
    return null;
  }
}
customElements.define("xbl-toolbar-menubar-stub", XblToolbarMenubarStub);
