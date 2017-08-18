class FirefoxTabbrowserTabbox extends FirefoxTabbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-tabbrowser-tabbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get tabs() {
    return document.getBindingParent(this).tabContainer;
  }
}
customElements.define("firefox-tabbrowser-tabbox", FirefoxTabbrowserTabbox);
