class XblToolbarMenubarAutohide extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbar-menubar-autohide ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbar-menubar-autohide",
  XblToolbarMenubarAutohide
);
