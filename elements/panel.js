class XblPanel extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-panel");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panel", XblPanel);
