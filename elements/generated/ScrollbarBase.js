class XblScrollbarBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-scrollbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar-base", XblScrollbarBase);
