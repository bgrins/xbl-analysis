class FirefoxGrippy extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-grippy");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-grippy", FirefoxGrippy);
