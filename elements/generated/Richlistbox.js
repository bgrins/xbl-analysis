class XblRichlistbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="listheader">
</children>
<scrollbox allowevents="true" orient="vertical" anonid="main-box" flex="1" style="overflow: auto;" xbl:inherits="dir,pack">
<children>
</children>
</scrollbox>`;
    let comment = document.createComment("Creating xbl-richlistbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get itemCount() {
    return this.children.length;
  }
}
customElements.define("xbl-richlistbox", XblRichlistbox);
