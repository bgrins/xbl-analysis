class XblResizer extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-resizer");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-resizer", XblResizer);
