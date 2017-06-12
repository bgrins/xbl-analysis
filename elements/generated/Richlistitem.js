class XblRichlistitem extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>`;
    let comment = document.createComment("Creating xbl-richlistitem");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-richlistitem", XblRichlistitem);
