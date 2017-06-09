class XblFindbarTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-findbar-textbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-findbar-textbox", XblFindbarTextbox);
