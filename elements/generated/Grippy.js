class XblGrippy extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-grippy");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-grippy", XblGrippy);
