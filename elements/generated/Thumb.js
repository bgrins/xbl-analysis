class XblThumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-thumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-thumb", XblThumb);
