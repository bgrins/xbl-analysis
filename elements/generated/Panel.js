class XblPanel extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-panel");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panel", XblPanel);
