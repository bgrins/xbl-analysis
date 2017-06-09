class XblToolbarDrag extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbar-drag";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbar-drag", XblToolbarDrag);
