class XblIframe extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-iframe");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-iframe", XblIframe);
