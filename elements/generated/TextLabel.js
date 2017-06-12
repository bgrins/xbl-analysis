class XblTextLabel extends XblTextBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-text-label");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get control() {
    return getAttribute("control");
  }
}
customElements.define("xbl-text-label", XblTextLabel);
