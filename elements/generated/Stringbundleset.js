class FirefoxStringbundleset extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-stringbundleset");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-stringbundleset", FirefoxStringbundleset);
