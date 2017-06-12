class XblStringbundleset extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-stringbundleset");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-stringbundleset", XblStringbundleset);
