class XblResizer extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-resizer");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-resizer", XblResizer);
