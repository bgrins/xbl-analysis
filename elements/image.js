class XblImage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-image ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-image", XblImage);
