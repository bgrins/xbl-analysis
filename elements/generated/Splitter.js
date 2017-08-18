class FirefoxSplitter extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-splitter");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-splitter", FirefoxSplitter);
