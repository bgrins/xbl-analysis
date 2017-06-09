class XblArrowscrollboxClicktoscroll extends XblArrowscrollbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-arrowscrollbox-clicktoscroll";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-arrowscrollbox-clicktoscroll",
  XblArrowscrollboxClicktoscroll
);
