class XblRichlistbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-richlistbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-richlistbox", XblRichlistbox);
