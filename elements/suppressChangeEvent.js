class XblSuppresschangeevent extends XblScale {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-suppresschangeevent";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-suppresschangeevent", XblSuppresschangeevent);
