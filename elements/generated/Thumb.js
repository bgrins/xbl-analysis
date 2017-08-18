class FirefoxThumb extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-thumb");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-thumb", FirefoxThumb);
