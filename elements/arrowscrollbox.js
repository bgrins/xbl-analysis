class XblArrowscrollbox extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-arrowscrollbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-arrowscrollbox", XblArrowscrollbox);
