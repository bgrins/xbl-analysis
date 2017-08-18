class FirefoxWindowdragbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-windowdragbox");
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}
}
customElements.define("firefox-windowdragbox", FirefoxWindowdragbox);
