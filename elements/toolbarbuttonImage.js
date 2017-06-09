class XblToolbarbuttonImage extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-toolbarbutton-image";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-image", XblToolbarbuttonImage);
