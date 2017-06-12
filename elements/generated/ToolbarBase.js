class XblToolbarBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-toolbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar-base", XblToolbarBase);
