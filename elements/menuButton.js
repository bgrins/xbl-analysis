class XblMenuButton extends XblMenuButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menu-button";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-button", XblMenuButton);
