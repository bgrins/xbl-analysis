class XblTabbrowserCloseTabButton extends XblToolbarbuttonImage {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-tabbrowser-close-tab-button"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-tabbrowser-close-tab-button",
  XblTabbrowserCloseTabButton
);
