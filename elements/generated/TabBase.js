class XblTabBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-tab-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tab-base", XblTabBase);
