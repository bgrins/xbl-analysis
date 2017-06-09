class XblMenuitemBase extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menuitem-base";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-base", XblMenuitemBase);
