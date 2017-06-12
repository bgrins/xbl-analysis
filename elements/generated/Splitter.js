class XblSplitter extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-splitter");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-splitter", XblSplitter);
