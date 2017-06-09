class XblMenuMenubar extends XblMenuBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-menubar";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-menubar", XblMenuMenubar);
