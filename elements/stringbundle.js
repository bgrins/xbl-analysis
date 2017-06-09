class XblStringbundle extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-stringbundle");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundle", XblStringbundle);
