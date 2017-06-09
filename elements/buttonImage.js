class XblButtonImage extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="button-image-icon" xbl:inherits="src=image">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-button-image ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-image", XblButtonImage);
