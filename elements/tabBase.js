class XblTabBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-tab-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tab-base", XblTabBase);
