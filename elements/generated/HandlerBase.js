class XblHandlerBase extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-handler-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get type() {
    undefined;
  }
}
customElements.define("xbl-handler-base", XblHandlerBase);
