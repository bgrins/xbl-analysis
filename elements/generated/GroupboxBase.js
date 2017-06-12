class XblGroupboxBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-groupbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox-base", XblGroupboxBase);
