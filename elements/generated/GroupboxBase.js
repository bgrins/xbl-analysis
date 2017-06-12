class XblGroupboxBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-groupbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox-base", XblGroupboxBase);
