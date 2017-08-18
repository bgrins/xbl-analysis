class FirefoxListrows extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-listrows");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listrows", FirefoxListrows);
