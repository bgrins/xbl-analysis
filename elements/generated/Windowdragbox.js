class XblWindowdragbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      undefined;
    } catch (e) {}

    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-windowdragbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-windowdragbox", XblWindowdragbox);
