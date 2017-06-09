class XblToolbarbuttonImage extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="toolbarbutton-icon" xbl:inherits="src=image">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-toolbarbutton-image ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-image", XblToolbarbuttonImage);
