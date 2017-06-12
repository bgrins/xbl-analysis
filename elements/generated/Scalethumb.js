class XblScalethumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-scalethumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scalethumb", XblScalethumb);
