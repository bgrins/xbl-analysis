class XblStringbundle extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-stringbundle");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundle", XblStringbundle);
