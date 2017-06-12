class XblTextLabel extends XblTextBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-text-label");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-text-label", XblTextLabel);
