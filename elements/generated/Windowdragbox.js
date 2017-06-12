class XblWindowdragbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-windowdragbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-windowdragbox", XblWindowdragbox);
