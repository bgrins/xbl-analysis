class XblScrollbar extends XblScrollbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-scrollbar";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar", XblScrollbar);
