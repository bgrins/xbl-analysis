class XblThumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-thumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-thumb", XblThumb);
