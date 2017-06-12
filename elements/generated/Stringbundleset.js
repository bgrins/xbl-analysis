class XblStringbundleset extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-stringbundleset");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundleset", XblStringbundleset);
