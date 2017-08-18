class XblTabbrowserTabbox extends XblTabbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-tabbrowser-tabbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get tabs() {
    return document.getBindingParent(this).tabContainer;
  }
}
customElements.define("xbl-tabbrowser-tabbox", XblTabbrowserTabbox);
