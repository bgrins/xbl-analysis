class XblFindbar extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-findbar";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-findbar", XblFindbar);
