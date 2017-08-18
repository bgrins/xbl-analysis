class FirefoxGroupboxBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-groupbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-groupbox-base", FirefoxGroupboxBase);
