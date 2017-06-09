class XblRichlistitem extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-richlistitem";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-richlistitem", XblRichlistitem);
