class XblScalethumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-scalethumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scalethumb", XblScalethumb);
