class XblTreecolImage extends XblTreecolBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="treecol-icon" xbl:inherits="src">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-treecol-image ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecol-image", XblTreecolImage);
