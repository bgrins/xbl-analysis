class XblSearchTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-search-textbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-search-textbox", XblSearchTextbox);
