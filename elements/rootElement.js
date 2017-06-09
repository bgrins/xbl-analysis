class XblRootElement extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-root-element");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-root-element", XblRootElement);
