class XblGrippy extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-grippy");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-grippy", XblGrippy);
