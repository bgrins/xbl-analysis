class XblScrollbox extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-scrollbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox", XblScrollbox);
