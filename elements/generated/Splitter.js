class XblSplitter extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-splitter");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-splitter", XblSplitter);
