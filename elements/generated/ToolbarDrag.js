class XblToolbarDrag extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-toolbar-drag");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar-drag", XblToolbarDrag);
