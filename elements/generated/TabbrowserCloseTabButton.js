class FirefoxTabbrowserCloseTabButton extends FirefoxToolbarbuttonImage {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-tabbrowser-close-tab-button"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-tabbrowser-close-tab-button",
  FirefoxTabbrowserCloseTabButton
);
