class XblFindbarTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-findbar-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-findbar-textbox", XblFindbarTextbox);
