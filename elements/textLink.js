class XblTextLink extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-text-link");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-link", XblTextLink);
