class XblMenubuttonItem extends XblMenuitemBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-menubutton-item";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menubutton-item", XblMenubuttonItem);
