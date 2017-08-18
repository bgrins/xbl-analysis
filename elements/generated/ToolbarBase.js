class FirefoxToolbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-toolbar-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbar-base", FirefoxToolbarBase);
