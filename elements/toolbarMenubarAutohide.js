class XblToolbarMenubarAutohide extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbar-menubar-autohide";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbar-menubar-autohide",
  XblToolbarMenubarAutohide
);
