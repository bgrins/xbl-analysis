class FirefoxTabBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-tab-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-tab-base", FirefoxTabBase);
