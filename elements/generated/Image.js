class FirefoxImage extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {}
  disconnectedCallback() {}

  set src(val) {
    this.setAttribute("src", val);
    return val;
  }

  get src() {
    return this.getAttribute("src");
  }
}
customElements.define("firefox-image", FirefoxImage);
