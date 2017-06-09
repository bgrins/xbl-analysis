class XblTextBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-text-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-base", XblTextBase);
