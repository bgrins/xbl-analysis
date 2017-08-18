class FirefoxScrollbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-scrollbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scrollbar-base", FirefoxScrollbarBase);
