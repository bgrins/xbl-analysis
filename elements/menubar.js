class XblMenubar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menubar";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubar", XblMenubar);
