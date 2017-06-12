class XblImage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-image", XblImage);
