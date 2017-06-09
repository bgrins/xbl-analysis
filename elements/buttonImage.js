class XblButtonImage extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-button-image";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-image", XblButtonImage);
