class XblEditor extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-editor");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-editor", XblEditor);
