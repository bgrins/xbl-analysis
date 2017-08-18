class FirefoxScalethumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-scalethumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scalethumb", FirefoxScalethumb);
