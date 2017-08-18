class FirefoxImage extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-image");
    this.prepend(comment);
  }
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
